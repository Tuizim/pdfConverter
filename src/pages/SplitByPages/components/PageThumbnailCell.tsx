import { useState } from 'react';
import { CheckCircleIcon } from '@/components/icons';
import { useIntersectionOnce } from '@/hooks/useIntersectionOnce.hook';
import { cn } from '@/utils/cn.util';
import type { PageThumbnailCellProps } from './PageThumbnailCell.model';

export function PageThumbnailCell({
  pageNumber,
  selected,
  onToggle,
  renderPage,
}: PageThumbnailCellProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const { ref } = useIntersectionOnce(() => {
    renderPage(pageNumber)
      .then(setThumbnailUrl)
      .catch(() => undefined);
  });

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onToggle(pageNumber)}
      aria-pressed={selected}
      className={cn(
        'group flex flex-col items-center gap-1 rounded-xl border-2 p-1 transition-all',
        selected
          ? 'border-brand-500 bg-brand-50'
          : 'border-transparent hover:border-gray-300 hover:bg-gray-50',
      )}
    >
      <div className="relative flex h-24 w-16 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400">{pageNumber}</span>
        )}
        {selected && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-white">
            <CheckCircleIcon className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
      <span
        className={cn('text-xs', selected ? 'font-semibold text-brand-700' : 'text-gray-600')}
      >
        {pageNumber}
      </span>
    </button>
  );
}
