import type { PdfFileItem } from '@/models/pdf-file.model';

export interface UseMergeFileListResult {
  files: PdfFileItem[];
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  clearFiles: () => void;
}
