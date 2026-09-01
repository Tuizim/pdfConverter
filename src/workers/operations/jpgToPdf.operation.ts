import type mupdfNamespace from 'mupdf';
import type { PDFDocument } from 'mupdf';
import type { CancelToken } from '@/models/cancel-token.model';
import type {
  JpgToPdfProgress,
  JpgToPdfWorkerInput,
  JpgToPdfWorkerResult,
} from '@/models/jpg-to-pdf.model';
import { OperationCancelledError } from '@/utils/errors.util';
import { getMupdf, resolveFileBytes } from '../mupdfRuntime';

async function addImagePage(
  outputDoc: PDFDocument,
  mupdf: typeof mupdfNamespace,
  bytes: Uint8Array,
  fileName: string,
): Promise<void> {
  let image;
  try {
    image = new mupdf.Image(bytes);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Falha ao abrir "${fileName}": ${reason}`);
  }
  try {
    const width = image.getWidth();
    const height = image.getHeight();
    const imageRef = outputDoc.addImage(image);
    const contents = `q ${width} 0 0 ${height} 0 0 cm /Im0 Do Q`;
    const pageObj = outputDoc.addPage(
      [0, 0, width, height],
      0,
      { XObject: { Im0: imageRef } },
      contents,
    );
    outputDoc.insertPage(outputDoc.countPages(), pageObj);
  } finally {
    image.destroy();
  }
}

export async function jpgsToPdf(
  inputs: JpgToPdfWorkerInput[],
  onProgress: (progress: JpgToPdfProgress) => void,
  cancelToken: CancelToken,
): Promise<JpgToPdfWorkerResult> {
  const totalImages = inputs.length;
  onProgress({ stage: 'preparando', imagesProcessed: 0, totalImages });

  const mupdf = await getMupdf();
  const outputDoc = new mupdf.PDFDocument();
  try {
    for (let index = 0; index < inputs.length; index += 1) {
      if (await cancelToken.isCancelled()) throw new OperationCancelledError();
      const input = inputs[index]!;
      const bytes = await resolveFileBytes(input.id, input.file);
      await addImagePage(outputDoc, mupdf, bytes, input.name);
      onProgress({ stage: 'inserindo-imagens', imagesProcessed: index + 1, totalImages });
    }

    onProgress({ stage: 'salvando', imagesProcessed: totalImages, totalImages });

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
}
