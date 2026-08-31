import type { CancelToken } from '@/models/cancel-token.model';
import type {
  PageGroupRequest,
  SplitByPagesProgress,
  SplitOutputFile,
  SplitWorkerInput,
} from '@/models/split.model';
import { OperationCancelledError } from '@/utils/errors.util';
import { buildAndSerializePages, openPdf, resolveFileBytes } from '../mupdfRuntime';

export async function extractPageGroups(
  input: SplitWorkerInput,
  groups: PageGroupRequest[],
  onProgress: (progress: SplitByPagesProgress) => void,
  cancelToken: CancelToken,
): Promise<SplitOutputFile[]> {
  const bytes = await resolveFileBytes(input.fileName, input.file);
  const srcDoc = await openPdf(bytes, input.fileName);

  try {
    const outputs: SplitOutputFile[] = [];
    const totalFiles = groups.length;

    for (let i = 0; i < groups.length; i += 1) {
      if (await cancelToken.isCancelled()) throw new OperationCancelledError();

      const group = groups[i]!;
      const pageIndexes = group.pages.map((pageNumber) => pageNumber - 1);
      const outputBytes = await buildAndSerializePages(srcDoc, pageIndexes);
      outputs.push({ name: group.name, bytes: outputBytes });

      onProgress({ filesGenerated: i + 1, totalFiles });
    }

    return outputs;
  } finally {
    srcDoc.destroy();
  }
}
