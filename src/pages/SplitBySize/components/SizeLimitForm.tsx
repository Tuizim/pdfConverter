import { useState, type ChangeEvent } from 'react';
import { Button } from '@/components/Button';
import { formatBytes } from '@/utils/formatBytes.util';
import type { SizeLimitFormProps } from './SizeLimitForm.model';

export function SizeLimitForm({ fileSizeBytes, onSubmit }: SizeLimitFormProps) {
  const [limitMB, setLimitMB] = useState(10);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLimitMB(Math.max(1, Number(event.target.value) || 1));
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft">
      <label htmlFor="limit-mb" className="text-sm font-medium text-gray-700">
        Tamanho máximo por arquivo
      </label>
      <div className="relative w-32">
        <input
          id="limit-mb"
          type="number"
          min={1}
          value={limitMB}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-3 pr-9 text-sm font-medium focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-gray-400">
          MB
        </span>
      </div>
      <p className="text-xs text-gray-500">O arquivo original tem {formatBytes(fileSizeBytes)}.</p>
      <Button size="lg" className="mt-1" onClick={() => onSubmit(limitMB)}>
        Dividir por tamanho
      </Button>
    </div>
  );
}
