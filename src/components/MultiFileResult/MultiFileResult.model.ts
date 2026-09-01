import type { SplitOutputFile } from '@/models/split.model';

export interface MultiFileResultProps {
  files: SplitOutputFile[];
  zipFileName: string;
  onRestart: () => void;
  restartLabel?: string;
}
