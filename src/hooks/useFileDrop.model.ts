import type { DragEvent } from 'react';

export interface UseFileDropResult {
  isDragging: boolean;
  dragHandlers: {
    onDragOver: (event: DragEvent) => void;
    onDragLeave: (event: DragEvent) => void;
    onDrop: (event: DragEvent) => void;
  };
}
