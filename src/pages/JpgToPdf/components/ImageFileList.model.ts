import type { ImageFileItem } from '@/models/image-file.model';

export interface ImageFileListProps {
  files: ImageFileItem[];
  onRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}
