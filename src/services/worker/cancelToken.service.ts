import type { CancelToken } from '@/models/cancel-token.model';

export function createCancelToken(): CancelToken {
  let cancelled = false;
  return {
    requestCancel: () => {
      cancelled = true;
    },
    isCancelled: () => cancelled,
  };
}
