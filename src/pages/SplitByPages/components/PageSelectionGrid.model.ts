import type { PageGroupRequest } from '@/models/split.model';

export interface PageSelectionGridProps {
  file: File;
  totalPages: number;
  baseName: string;
  onSubmit: (groups: PageGroupRequest[]) => void;
}
