import * as Comlink from 'comlink';
import type { CancelToken } from '@/models/cancel-token.model';
import type {
  PageGroupRequest,
  SplitByPagesProgress,
  SplitOutputFile,
  SplitWorkerInput,
} from '@/models/split.model';
import { getPdfWorkerApi } from '@/services/worker/pdfWorkerClient.service';
import { isOperationCancelledError } from '@/utils/errors.util';

export async function extractPageGroupsFromPdf(
  input: SplitWorkerInput,
  groups: PageGroupRequest[],
  onProgress: (progress: SplitByPagesProgress) => void,
  cancelToken: CancelToken,
): Promise<SplitOutputFile[]> {
  try {
    const workerApi = getPdfWorkerApi();
    return await workerApi.extractPageGroups(
      input,
      groups,
      Comlink.proxy(onProgress),
      Comlink.proxy(cancelToken),
    );
  } catch (error) {
    if (isOperationCancelledError(error)) throw error;
    console.error('[pdfSplitByPages.service] falha ao extrair páginas', error);
    throw error instanceof Error ? error : new Error('Não foi possível dividir o PDF.');
  }
}
