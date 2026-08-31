import type { PdfPreview } from '@/models/pdf-preview.model';

export interface SplitSizeConfiguratorProps {
  file: File;
  preview: PdfPreview;
  onSubmit: (limitMB: number) => void;
}
