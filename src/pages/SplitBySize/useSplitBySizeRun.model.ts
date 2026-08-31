import type {
  SplitBySizeProgress,
  SplitBySizeWarningInfo,
  SplitOutputFile,
  SplitWorkerInput,
} from '@/models/split.model';
import type { SplitBySizeStep } from './SplitBySize.model';

export interface UseSplitBySizeRunResult {
  step: SplitBySizeStep;
  progress: SplitBySizeProgress | null;
  error: string | null;
  resultFiles: SplitOutputFile[] | null;
  warnings: SplitBySizeWarningInfo[];
  run: (input: SplitWorkerInput, limitMB: number) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}
