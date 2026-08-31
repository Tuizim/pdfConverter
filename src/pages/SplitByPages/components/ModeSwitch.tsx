import { cn } from '@/utils/cn.util';
import type { SplitPagesMode } from '../SplitByPages.model';
import type { ModeSwitchProps } from './ModeSwitch.model';

const OPTIONS: Array<{ value: SplitPagesMode; label: string }> = [
  { value: 'intervalos', label: 'Intervalos' },
  { value: 'a-cada-n', label: 'A cada N páginas' },
  { value: 'selecionar', label: 'Selecionar páginas' },
];

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <div role="tablist" className="inline-flex gap-1 rounded-lg bg-gray-100 p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          role="tab"
          type="button"
          aria-selected={mode === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            mode === option.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
