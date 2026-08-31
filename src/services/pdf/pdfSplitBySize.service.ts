import * as Comlink from 'comlink';
import type { CancelToken } from '@/models/cancel-token.model';
import type { SplitBySizeProgress, SplitBySizeRunResult, SplitWorkerInput } from '@/models/split.model';
import { getPdfWorkerApi } from '@/services/worker/pdfWorkerClient.service';
import { isOperationCancelledError } from '@/utils/errors.util';

export async function splitPdfBySize(
  input: SplitWorkerInput,
  limitBytes: number,
  onProgress: (progress: SplitBySizeProgress) => void,
  cancelToken: CancelToken,
): Promise<SplitBySizeRunResult> {
  try {
    const workerApi = getPdfWorkerApi();
    return await workerApi.splitBySize(
      input,
      limitBytes,
      Comlink.proxy(onProgress),
      Comlink.proxy(cancelToken),
    );
  } catch (error) {
    if (isOperationCancelledError(error)) throw error;
    console.error('[pdfSplitBySize.service] falha ao dividir PDF por tamanho', error);
    throw error instanceof Error ? error : new Error('Não foi possível dividir o PDF por tamanho.');
  }
}
