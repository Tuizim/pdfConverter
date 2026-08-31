import type { PageGroupRequest, SplitByPagesProgress, SplitOutputFile, SplitWorkerInput } from '@/models/split.model';
import type { SplitByPagesStep } from './SplitByPages.model';

export interface UseSplitByPagesRunResult {
  step: SplitByPagesStep;
  progress: SplitByPagesProgress | null;
  error: string | null;
  resultFiles: SplitOutputFile[] | null;
  run: (input: SplitWorkerInput, groups: PageGroupRequest[]) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}
