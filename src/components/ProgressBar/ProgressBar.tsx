import type { ProgressBarProps } from './ProgressBar.model';

export function ProgressBar({ label, current, total, onCancel }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-soft"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-semibold text-brand-600">{percent}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="self-start text-sm font-medium text-red-600 transition-colors hover:text-red-700 hover:underline"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
