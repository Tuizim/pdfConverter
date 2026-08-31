import { useState } from 'react';
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
        'flex flex-col items-center gap-1 rounded-lg border-2 p-1 transition-colors',
        selected ? 'border-brand-500 bg-brand-50' : 'border-transparent hover:border-gray-300',
      )}
    >
      <div className="flex h-24 w-16 items-center justify-center overflow-hidden rounded border bg-gray-50">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400">{pageNumber}</span>
        )}
      </div>
      <span className="text-xs text-gray-600">{pageNumber}</span>
    </button>
  );
}
