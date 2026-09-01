import { useRef } from 'react';
import { ImageFileItem } from './ImageFileItem';
import type { ImageFileListProps } from './ImageFileList.model';

export function ImageFileList({ files, onRemove, onReorder }: ImageFileListProps) {
  const draggedIndexRef = useRef<number | null>(null);

  const dragHandlers = {
    onDragStart: (index: number) => {
      draggedIndexRef.current = index;
    },
    onDragOver: (index: number) => {
      const fromIndex = draggedIndexRef.current;
      if (fromIndex === null || fromIndex === index) return;
      onReorder(fromIndex, index);
      draggedIndexRef.current = index;
    },
    onDrop: () => {
      draggedIndexRef.current = null;
    },
  };

  return (
    <ul className="flex flex-col gap-2">
      {files.map((item, index) => (
        <ImageFileItem
          key={item.id}
          item={item}
          index={index}
          onRemove={onRemove}
          dragHandlers={dragHandlers}
        />
      ))}
    </ul>
  );
}
