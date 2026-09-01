import { formatBytes } from '@/utils/formatBytes.util';
import { SizeLimitForm } from './SizeLimitForm';
import type { SplitSizeConfiguratorProps } from './SplitSizeConfigurator.model';

export function SplitSizeConfigurator({ file, preview, onSubmit }: SplitSizeConfiguratorProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-soft">
        <img
          src={preview.thumbnailUrl}
          alt=""
          className="h-20 w-14 rounded-md border border-gray-200 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
          <p className="text-xs text-gray-500">
            {preview.pageCount} páginas · {formatBytes(file.size)}
          </p>
        </div>
      </div>
      <SizeLimitForm fileSizeBytes={file.size} onSubmit={onSubmit} />
    </div>
  );
}
