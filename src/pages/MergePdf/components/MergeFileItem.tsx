import type { DragEvent } from 'react';
import { GripIcon } from '@/components/GripIcon';
import { formatBytes } from '@/utils/formatBytes.util';
import type { MergeFileItemProps } from './MergeFileItem.model';

export function MergeFileItem({ item, index, onRemove, dragHandlers }: MergeFileItemProps) {
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    dragHandlers.onDragOver(index);
  };

  return (
    <li
      draggable
      onDragStart={() => dragHandlers.onDragStart(index)}
      onDragOver={handleDragOver}
      onDrop={dragHandlers.onDrop}
      className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm"
    >
      <span className="cursor-grab text-gray-400">
        <GripIcon />
      </span>
      {item.thumbnailUrl ? (
        <img src={item.thumbnailUrl} alt="" className="h-16 w-12 rounded border object-cover" />
      ) : (
        <div className="h-16 w-12 animate-pulse rounded border bg-gray-100" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
        <p className="text-xs text-gray-500">
          {formatBytes(item.size)}
          {item.pageCount !== null && ` · ${item.pageCount} páginas`}
        </p>
        {item.status === 'erro' && <p className="text-xs text-red-600">{item.errorMessage}</p>}
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remover ${item.name}`}
        className="text-sm font-medium text-gray-500 hover:text-red-600"
      >
        Remover
      </button>
    </li>
  );
}
