import type { PdfFileItem } from '@/models/pdf-file.model';

export interface MergeFileItemDragHandlers {
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: () => void;
}

export interface MergeFileItemProps {
  item: PdfFileItem;
  index: number;
  onRemove: (id: string) => void;
  dragHandlers: MergeFileItemDragHandlers;
}
