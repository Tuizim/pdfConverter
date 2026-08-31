import type { PageGroupRequest } from '@/models/split.model';

export interface RangesFormProps {
  totalPages: number;
  baseName: string;
  onSubmit: (groups: PageGroupRequest[]) => void;
}
