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
    <div className="flex flex-col gap-3">
      <label htmlFor="limit-mb" className="text-sm font-medium text-gray-700">
        Tamanho máximo por arquivo (MB)
      </label>
      <input
        id="limit-mb"
        type="number"
        min={1}
        value={limitMB}
        onChange={handleChange}
        className="w-32 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />
      <p className="text-xs text-gray-500">O arquivo original tem {formatBytes(fileSizeBytes)}.</p>
      <Button onClick={() => onSubmit(limitMB)}>Dividir por tamanho</Button>
    </div>
  );
}
