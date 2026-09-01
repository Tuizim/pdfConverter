import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/Button';
import { parsePageRanges } from '@/utils/parsePageRanges.util';
import type { RangesFormProps } from './RangesForm.model';

function buildGroupName(baseName: string, pages: number[]): string {
  if (pages.length === 1) return `${baseName}-pagina-${pages[0]}.pdf`;
  return `${baseName}-paginas-${pages[0]}-${pages[pages.length - 1]}.pdf`;
}

export function RangesForm({ totalPages, baseName, onSubmit }: RangesFormProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setInput(event.target.value);

  const handleSubmit = () => {
    const result = parsePageRanges(input, totalPages);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setError(null);
    onSubmit(result.groups.map((pages) => ({ name: buildGroupName(baseName, pages), pages })));
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
      <label htmlFor="ranges-input" className="text-sm font-medium text-gray-700">
        Intervalos de páginas
      </label>
      <input
        id="ranges-input"
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="ex: 1-3, 7, 10-12"
        className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      <p className="text-xs text-gray-500">O documento tem {totalPages} páginas.</p>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <Button size="lg" className="mt-1" onClick={handleSubmit} disabled={input.trim().length === 0}>
        Dividir
      </Button>
    </div>
  );
}
