import type { MergeProgress, MergeWorkerInput } from '@/models/merge.model';
import type { MergePdfStep } from './MergePdf.model';

export interface UseMergeRunResult {
  step: MergePdfStep;
  progress: MergeProgress | null;
  error: string | null;
  resultBlob: Blob | null;
  run: (inputs: MergeWorkerInput[]) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}
