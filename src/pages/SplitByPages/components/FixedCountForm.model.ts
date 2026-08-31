import type { PageGroupRequest } from '@/models/split.model';

export interface FixedCountFormProps {
  totalPages: number;
  baseName: string;
  onSubmit: (groups: PageGroupRequest[]) => void;
}
