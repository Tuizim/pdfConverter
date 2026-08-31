import type { ProgressBarProps } from './ProgressBar.model';

export function ProgressBar({ label, current, total, onCancel }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-2" role="status" aria-live="polite">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="self-start text-sm font-medium text-red-600 hover:underline"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
