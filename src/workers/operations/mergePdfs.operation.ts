import type { PDFDocument } from 'mupdf';
import type { CancelToken } from '@/models/cancel-token.model';
import type { MergeProgress, MergeWorkerInput, MergeWorkerResult } from '@/models/merge.model';
import { OperationCancelledError } from '@/utils/errors.util';
import { getMupdf, openPdf, resolveFileBytes } from '../mupdfRuntime';

async function openAllSources(
  inputs: MergeWorkerInput[],
  cancelToken: CancelToken,
): Promise<PDFDocument[]> {
  const sourceDocs: PDFDocument[] = [];
  for (const input of inputs) {
    if (await cancelToken.isCancelled()) throw new OperationCancelledError();
    try {
      const bytes = await resolveFileBytes(input.id, input.file);
      sourceDocs.push(await openPdf(bytes, input.name));
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`Falha ao abrir "${input.name}": ${reason}`);
    }
  }
  return sourceDocs;
}

async function graftAllPages(
  sourceDocs: PDFDocument[],
  outputDoc: PDFDocument,
  cancelToken: CancelToken,
  onProgress: (progress: MergeProgress) => void,
  totalPages: number,
): Promise<void> {
  const totalFiles = sourceDocs.length;
  let pagesProcessed = 0;

  for (let fileIndex = 0; fileIndex < sourceDocs.length; fileIndex += 1) {
    const srcDoc = sourceDocs[fileIndex]!;
    const pageCount = srcDoc.countPages();
    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      if (await cancelToken.isCancelled()) throw new OperationCancelledError();
      outputDoc.graftPage(outputDoc.countPages(), srcDoc, pageIndex);
      pagesProcessed += 1;
      onProgress({
        stage: 'copiando-paginas',
        filesProcessed: fileIndex,
        totalFiles,
        pagesProcessed,
        totalPages,
      });
    }
  }
}

export async function mergePdfs(
  inputs: MergeWorkerInput[],
  onProgress: (progress: MergeProgress) => void,
  cancelToken: CancelToken,
): Promise<MergeWorkerResult> {
  const totalFiles = inputs.length;
  const sourceDocs = await openAllSources(inputs, cancelToken);

  try {
    const totalPages = sourceDocs.reduce((sum, doc) => sum + doc.countPages(), 0);
    onProgress({ stage: 'preparando', filesProcessed: 0, totalFiles, pagesProcessed: 0, totalPages });

    const mupdf = await getMupdf();
    const outputDoc = new mupdf.PDFDocument();
    try {
      await graftAllPages(sourceDocs, outputDoc, cancelToken, onProgress, totalPages);

      onProgress({
        stage: 'salvando',
        filesProcessed: totalFiles,
        totalFiles,
        pagesProcessed: totalPages,
        totalPages,
      });

      const outputBuffer = outputDoc.saveToBuffer();
      try {
        const bytes = outputBuffer.asUint8Array().slice();
        return { bytes, pageCount: outputDoc.countPages() };
      } finally {
        outputBuffer.destroy();
      }
    } finally {
      outputDoc.destroy();
    }
  } finally {
    for (const doc of sourceDocs) doc.destroy();
  }
}
