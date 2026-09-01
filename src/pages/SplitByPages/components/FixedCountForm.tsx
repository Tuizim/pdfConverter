import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/Button';
import { computeFixedPageChunks } from '@/utils/computeFixedPageChunks.util';
import type { FixedCountFormProps } from './FixedCountForm.model';

export function FixedCountForm({ totalPages, baseName, onSubmit }: FixedCountFormProps) {
  const [pagesPerFile, setPagesPerFile] = useState(1);
  const fileCount = Math.ceil(totalPages / pagesPerFile);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPagesPerFile(Math.max(1, Number(event.target.value) || 1));
  };

  const handleSubmit = () => {
    const chunks = computeFixedPageChunks(totalPages, pagesPerFile);
    const totalDigits = String(chunks.length).length;
    onSubmit(
      chunks.map((pages, index) => ({
        name: `${baseName}-parte-${String(index + 1).padStart(totalDigits, '0')}.pdf`,
        pages,
      })),
    );
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
      <label htmlFor="pages-per-file" className="text-sm font-medium text-gray-700">
        Páginas por arquivo
      </label>
      <input
        id="pages-per-file"
        type="number"
        min={1}
        max={totalPages}
        value={pagesPerFile}
        onChange={handleChange}
        className="w-32 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      <p className="text-xs text-gray-500">
        Isso vai gerar {fileCount} arquivo{fileCount === 1 ? '' : 's'}.
      </p>
      <Button size="lg" className="mt-1" onClick={handleSubmit}>
        Dividir
      </Button>
    </div>
  );
}
