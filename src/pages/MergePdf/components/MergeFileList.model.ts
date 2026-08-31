import type { PdfFileItem } from '@/models/pdf-file.model';

export interface MergeFileListProps {
  files: PdfFileItem[];
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}
