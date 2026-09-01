import type { ImageFileItem } from '@/models/image-file.model';

export interface ImageFileItemDragHandlers {
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: () => void;
}

export interface ImageFileItemProps {
  item: ImageFileItem;
  index: number;
  onRemove: (id: string) => void;
  dragHandlers: ImageFileItemDragHandlers;
}
