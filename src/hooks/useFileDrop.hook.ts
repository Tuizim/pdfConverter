import { useCallback, useState, type DragEvent } from 'react';
import type { UseFileDropResult } from './useFileDrop.model';

export function useFileDrop(onFiles: (files: File[]) => void): UseFileDropResult {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      onFiles(Array.from(event.dataTransfer.files));
    },
    [onFiles],
  );

  return { isDragging, dragHandlers: { onDragOver, onDragLeave, onDrop } };
}
