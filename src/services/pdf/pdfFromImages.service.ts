import * as Comlink from 'comlink';
import type { CancelToken } from '@/models/cancel-token.model';
import type {
  JpgToPdfProgress,
  JpgToPdfWorkerInput,
  JpgToPdfWorkerResult,
} from '@/models/jpg-to-pdf.model';
import { getPdfWorkerApi } from '@/services/worker/pdfWorkerClient.service';
import { isOperationCancelledError } from '@/utils/errors.util';

export async function convertImagesToPdf(
  inputs: JpgToPdfWorkerInput[],
  onProgress: (progress: JpgToPdfProgress) => void,
  cancelToken: CancelToken,
): Promise<JpgToPdfWorkerResult> {
  try {
    const workerApi = getPdfWorkerApi();
    return await workerApi.jpgsToPdf(
      inputs,
      Comlink.proxy(onProgress),
      Comlink.proxy(cancelToken),
    );
  } catch (error) {
    if (isOperationCancelledError(error)) throw error;
    console.error('[pdfFromImages.service] falha ao converter imagens para PDF', error);
    throw error instanceof Error ? error : new Error('Não foi possível converter as imagens para PDF.');
  }
}
