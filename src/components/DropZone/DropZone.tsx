import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { UploadIcon } from '@/components/icons';
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
        'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-150',
        isDragging
          ? 'scale-[1.01] border-brand-500 bg-brand-50'
          : 'border-gray-300 bg-white hover:border-brand-400 hover:bg-brand-50/40',
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full transition-colors',
          isDragging ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500',
        )}
      >
        <UploadIcon className="h-7 w-7" />
      </div>
      <p className="text-lg font-medium text-gray-800">{label}</p>
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
