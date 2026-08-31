import type { CancelToken } from '@/models/cancel-token.model';
import type {
  SplitBySizeProgress,
  SplitBySizeRunResult,
  SplitWorkerInput,
} from '@/models/split.model';
import { planSplitBySize } from '@/services/pdf/splitBySize.service';
import type { AcceptedChunk } from '@/services/pdf/splitBySize.model';
import { buildAndSerializePages, openPdf, pageRange, resolveFileBytes } from '../mupdfRuntime';

const SAFETY_MARGIN = 0.95;
const MIN_FILL_RATIO = 0.8;
const MAX_PROBES = 6;

function buildOutputName(baseName: string, index: number): string {
  const withoutExtension = baseName.replace(/\.pdf$/i, '');
  const partNumber = String(index + 1).padStart(2, '0');
  return `${withoutExtension}-parte-${partNumber}.pdf`;
}

export async function splitBySize(
  input: SplitWorkerInput,
  limitBytes: number,
  onProgress: (progress: SplitBySizeProgress) => void,
  cancelToken: CancelToken,
): Promise<SplitBySizeRunResult> {
  const bytes = await resolveFileBytes(input.fileName, input.file);
  const srcDoc = await openPdf(bytes, input.fileName);

  try {
    const totalPages = srcDoc.countPages();
    const options = {
      targetBytes: limitBytes * SAFETY_MARGIN,
      minFillRatio: MIN_FILL_RATIO,
      maxProbes: MAX_PROBES,
      avgBytesPerPageHint: bytes.length / totalPages,
    };

    const outputs: SplitBySizeRunResult['outputs'] = [];
    let filesGenerated = 0;

    const measure = async (startPage: number, pageCount: number) => {
      const chunkBytes = await buildAndSerializePages(srcDoc, pageRange(startPage, pageCount));
      return chunkBytes.length;
    };

    const emitChunk = async (chunk: AcceptedChunk) => {
      const chunkBytes = await buildAndSerializePages(
        srcDoc,
        pageRange(chunk.startPage, chunk.pageCount),
      );
      filesGenerated += 1;
      outputs.push({ name: buildOutputName(input.fileName, outputs.length), bytes: chunkBytes });
      onProgress({
        pagesProcessed: chunk.startPage + chunk.pageCount,
        totalPages,
        filesGenerated,
      });
    };

    const { warnings } = await planSplitBySize(totalPages, options, measure, emitChunk, cancelToken);

    return {
      outputs,
      warnings: warnings.map((warning) => ({
        pageNumber: warning.pageIndex + 1,
        byteSize: warning.byteSize,
      })),
    };
  } finally {
    srcDoc.destroy();
  }
}
