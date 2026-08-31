import * as Comlink from 'comlink';
import type { PdfWorkerApi } from '@/workers/pdf.worker.model';

let workerApi: Comlink.Remote<PdfWorkerApi> | null = null;

// Uma única instância de worker (e, portanto, do WASM do mupdf) por sessão —
// recriar o worker a cada operação pagaria o custo de inicialização do WASM
// de novo toda vez.
export function getPdfWorkerApi(): Comlink.Remote<PdfWorkerApi> {
  if (!workerApi) {
    const worker = new Worker(new URL('../../workers/pdf.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerApi = Comlink.wrap<PdfWorkerApi>(worker);
  }
  return workerApi;
}
