import type { PdfPreview } from '@/models/pdf-preview.model';
import type { PageGroupRequest } from '@/models/split.model';
import type { SplitPagesMode } from '../SplitByPages.model';

export interface SplitPagesConfiguratorProps {
  file: File;
  preview: PdfPreview;
  mode: SplitPagesMode;
  onModeChange: (mode: SplitPagesMode) => void;
  onSubmit: (groups: PageGroupRequest[]) => void;
}
