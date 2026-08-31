import * as Comlink from 'comlink';
import type { CancelToken } from '@/models/cancel-token.model';
import type { MergeProgress, MergeWorkerInput, MergeWorkerResult } from '@/models/merge.model';
import { getPdfWorkerApi } from '@/services/worker/pdfWorkerClient.service';
import { isOperationCancelledError } from '@/utils/errors.util';

export async function mergePdfFiles(
  inputs: MergeWorkerInput[],
  onProgress: (progress: MergeProgress) => void,
  cancelToken: CancelToken,
): Promise<MergeWorkerResult> {
  try {
    const workerApi = getPdfWorkerApi();
    return await workerApi.mergePdfs(
      inputs,
      Comlink.proxy(onProgress),
      Comlink.proxy(cancelToken),
    );
  } catch (error) {
    if (isOperationCancelledError(error)) throw error;
    console.error('[pdfMerge.service] falha ao juntar PDFs', error);
    throw error instanceof Error ? error : new Error('Não foi possível juntar os arquivos PDF.');
  }
}
