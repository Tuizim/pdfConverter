import type { SplitOutputFile } from '@/models/split.model';

export interface IndividualFilesListProps {
  files: SplitOutputFile[];
  onDownloadOne: (index: number) => void;
}
