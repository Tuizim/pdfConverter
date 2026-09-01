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
      className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-soft transition-shadow hover:shadow-card"
    >
      <span className="cursor-grab text-gray-300 transition-colors group-hover:text-gray-500">
        <GripIcon />
      </span>
      {item.thumbnailUrl ? (
        <img
          src={item.thumbnailUrl}
          alt=""
          className="h-16 w-12 rounded-md border border-gray-200 object-cover"
        />
      ) : (
        <div className="h-16 w-12 animate-pulse rounded-md border border-gray-200 bg-gray-100" />
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
        className="rounded-lg px-2 py-1 text-sm font-medium text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        Remover
      </button>
    </li>
  );
}
