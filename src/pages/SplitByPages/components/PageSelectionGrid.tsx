import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/Button';
import type { PdfThumbnailSource } from '@/models/pdf-thumbnail-source.model';
import { openPdfThumbnailSource } from '@/services/thumbnail/thumbnail.service';
import { PageThumbnailCell } from './PageThumbnailCell';
import type { PageSelectionGridProps } from './PageSelectionGrid.model';

function useThumbnailSource(file: File): PdfThumbnailSource | null {
  const [source, setSource] = useState<PdfThumbnailSource | null>(null);

  useEffect(() => {
    let cancelled = false;
    openPdfThumbnailSource(file).then((loaded) => {
      if (cancelled) loaded.dispose();
      else setSource(loaded);
    });
    return () => {
      cancelled = true;
      setSource((current) => {
        current?.dispose();
        return null;
      });
    };
  }, [file]);

  return source;
}

export function PageSelectionGrid({ file, totalPages, baseName, onSubmit }: PageSelectionGridProps) {
  const source = useThumbnailSource(file);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  const toggle = (pageNumber: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(pageNumber)) next.delete(pageNumber);
      else next.add(pageNumber);
      return next;
    });
  };

  const handleSubmit = () => {
    const pages = Array.from(selected).sort((a, b) => a - b);
    onSubmit([{ name: `${baseName}-extraido.pdf`, pages }]);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600">Clique nas páginas que você quer extrair.</p>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {source &&
          pageNumbers.map((pageNumber) => (
            <PageThumbnailCell
              key={pageNumber}
              pageNumber={pageNumber}
              selected={selected.has(pageNumber)}
              onToggle={toggle}
              renderPage={source.renderPage}
            />
          ))}
      </div>
      <Button onClick={handleSubmit} disabled={selected.size === 0}>
        Extrair {selected.size} página{selected.size === 1 ? '' : 's'}
      </Button>
    </div>
  );
}
