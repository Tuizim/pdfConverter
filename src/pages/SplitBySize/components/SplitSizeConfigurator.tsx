import { formatBytes } from '@/utils/formatBytes.util';
import { SizeLimitForm } from './SizeLimitForm';
import type { SplitSizeConfiguratorProps } from './SplitSizeConfigurator.model';

export function SplitSizeConfigurator({ file, preview, onSubmit }: SplitSizeConfiguratorProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 rounded-lg border bg-white p-3">
        <img src={preview.thumbnailUrl} alt="" className="h-20 w-14 rounded border object-cover" />
        <div>
          <p className="text-sm font-medium text-gray-900">{file.name}</p>
          <p className="text-xs text-gray-500">
            {preview.pageCount} páginas · {formatBytes(file.size)}
          </p>
        </div>
      </div>
      <SizeLimitForm fileSizeBytes={file.size} onSubmit={onSubmit} />
    </div>
  );
}
