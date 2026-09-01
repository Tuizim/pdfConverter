import type { ImageFileItem } from '@/models/image-file.model';

export interface UseImageFileListResult {
  files: ImageFileItem[];
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  clearFiles: () => void;
}
