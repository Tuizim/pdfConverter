export interface CancelToken {
  requestCancel: () => void;
  isCancelled: () => boolean;
}
