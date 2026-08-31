import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { useFileDrop } from '@/hooks/useFileDrop.hook';
import { cn } from '@/utils/cn.util';
import type { DropZoneProps } from './DropZone.model';

export function DropZone({
  accept,
  label,
  onFilesSelected,
  multiple = false,
  helperText,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging, dragHandlers } = useFileDrop(onFilesSelected);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) onFilesSelected(Array.from(event.target.files));
    event.target.value = '';
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      {...dragHandlers}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors',
        isDragging ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-500',
      )}
    >
      <p className="text-lg font-medium text-gray-700">{label}</p>
      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
