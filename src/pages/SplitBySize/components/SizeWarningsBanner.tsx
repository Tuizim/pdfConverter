import { formatBytes } from '@/utils/formatBytes.util';
import type { SizeWarningsBannerProps } from './SizeWarningsBanner.model';

export function SizeWarningsBanner({ warnings, limitMB }: SizeWarningsBannerProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
      <p className="font-medium">Algumas páginas não couberam sozinhas no limite:</p>
      <ul className="list-disc pl-5">
        {warnings.map((warning) => (
          <li key={warning.pageNumber}>
            A página {warning.pageNumber} sozinha tem {formatBytes(warning.byteSize)} e não cabe no
            limite de {limitMB} MB — ela foi salva em um arquivo próprio, acima do limite.
          </li>
        ))}
      </ul>
    </div>
  );
}
