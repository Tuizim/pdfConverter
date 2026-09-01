import { formatBytes } from '@/utils/formatBytes.util';
import type { SizeWarningsBannerProps } from './SizeWarningsBanner.model';

export function SizeWarningsBanner({ warnings, limitMB }: SizeWarningsBannerProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l6.516 11.598c.75 1.334-.213 2.99-1.742 2.99H3.483c-1.53 0-2.492-1.656-1.742-2.99L8.257 3.1zM10 7a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <div className="flex flex-col gap-2">
        <p className="font-medium">Algumas páginas não couberam sozinhas no limite:</p>
        <ul className="list-disc space-y-1 pl-5">
          {warnings.map((warning) => (
            <li key={warning.pageNumber}>
              A página {warning.pageNumber} sozinha tem {formatBytes(warning.byteSize)} e não cabe
              no limite de {limitMB} MB, ela foi salva em um arquivo próprio, acima do limite.
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
