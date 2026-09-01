import type { CancelToken } from '@/models/cancel-token.model';
import { OperationCancelledError } from '@/utils/errors.util';
import type {
  AcceptedChunk,
  EmitChunkFn,
  MeasurePagesFn,
  SplitBySizeOptions,
  SplitBySizeResult,
  SplitBySizeWarning,
} from './splitBySize.model';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Uma medição para o mesmo par (start, pageCount) nunca deve rodar duas
// vezes: probing e a decisão final de cada pedaço frequentemente pedem o
// mesmo par.
function withMeasurementCache(measure: MeasurePagesFn): MeasurePagesFn {
  const cache = new Map<string, number>();
  return async (startPage, pageCount) => {
    const key = `${startPage}:${pageCount}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;
    const size = await measure(startPage, pageCount);
    cache.set(key, size);
    return size;
  };
}

async function findBestChunk(
  startPage: number,
  remainingPages: number,
  measure: MeasurePagesFn,
  options: SplitBySizeOptions,
  cancelToken?: CancelToken,
): Promise<{ pageCount: number; byteSize: number } | null> {
  const { targetBytes, minFillRatio, maxProbes, avgBytesPerPageHint } = options;

  let lo = 1;
  let hi = remainingPages;
  let best: { pageCount: number; byteSize: number } | null = null;
  let n = clamp(Math.floor(targetBytes / avgBytesPerPageHint), 1, remainingPages);

  for (let probes = 0; probes < maxProbes; probes += 1) {
    if (cancelToken && (await cancelToken.isCancelled())) throw new OperationCancelledError();

    const byteSize = await measure(startPage, n);

    if (byteSize > targetBytes) {
      hi = n - 1;
      if (hi < 1) break;
    } else {
      best = { pageCount: n, byteSize };
      lo = n;
      if (byteSize >= targetBytes * minFillRatio) break;
      if (n === remainingPages) break;
    }

    const next = lo + Math.floor((hi - lo + 1) / 2);
    if (next < 1 || next > remainingPages) break;
    n = next;
  }

  return best;
}

async function resolveChunkAtStart(
  startPage: number,
  totalPages: number,
  measure: MeasurePagesFn,
  options: SplitBySizeOptions,
  cancelToken?: CancelToken,
): Promise<{ chunk: AcceptedChunk; warning: SplitBySizeWarning | null }> {
  const remainingPages = totalPages - startPage;
  const best = await findBestChunk(startPage, remainingPages, measure, options, cancelToken);

  if (best !== null) {
    return {
      chunk: { startPage, pageCount: best.pageCount, byteSize: best.byteSize, oversized: false },
      warning: null,
    };
  }

  const byteSize = await measure(startPage, 1);
  return {
    chunk: { startPage, pageCount: 1, byteSize, oversized: true },
    warning: { pageIndex: startPage, byteSize },
  };
}

export async function planSplitBySize(
  totalPages: number,
  options: SplitBySizeOptions,
  measurePages: MeasurePagesFn,
  emitChunk: EmitChunkFn,
  cancelToken?: CancelToken,
): Promise<SplitBySizeResult> {
  const measure = withMeasurementCache(measurePages);
  const chunks: AcceptedChunk[] = [];
  const warnings: SplitBySizeResult['warnings'] = [];

  let startPage = 0;
  while (startPage < totalPages) {
    if (cancelToken && (await cancelToken.isCancelled())) throw new OperationCancelledError();

    const { chunk, warning } = await resolveChunkAtStart(
      startPage,
      totalPages,
      measure,
      options,
      cancelToken,
    );

    await emitChunk(chunk);
    chunks.push(chunk);
    if (warning) warnings.push(warning);
    startPage += chunk.pageCount;
  }

  return { chunks, warnings };
}
