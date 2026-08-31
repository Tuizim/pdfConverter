import { stripPdfExtension } from '@/utils/stripPdfExtension.util';
import { FixedCountForm } from './FixedCountForm';
import { ModeSwitch } from './ModeSwitch';
import { PageSelectionGrid } from './PageSelectionGrid';
import { RangesForm } from './RangesForm';
import type { SplitPagesConfiguratorProps } from './SplitPagesConfigurator.model';

export function SplitPagesConfigurator({
  file,
  preview,
  mode,
  onModeChange,
  onSubmit,
}: SplitPagesConfiguratorProps) {
  const baseName = stripPdfExtension(file.name);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 rounded-lg border bg-white p-3">
        <img src={preview.thumbnailUrl} alt="" className="h-20 w-14 rounded border object-cover" />
        <div>
          <p className="text-sm font-medium text-gray-900">{file.name}</p>
          <p className="text-xs text-gray-500">{preview.pageCount} páginas</p>
        </div>
      </div>

      <ModeSwitch mode={mode} onChange={onModeChange} />

      {mode === 'intervalos' && (
        <RangesForm totalPages={preview.pageCount} baseName={baseName} onSubmit={onSubmit} />
      )}
      {mode === 'a-cada-n' && (
        <FixedCountForm totalPages={preview.pageCount} baseName={baseName} onSubmit={onSubmit} />
      )}
      {mode === 'selecionar' && (
        <PageSelectionGrid
          file={file}
          totalPages={preview.pageCount}
          baseName={baseName}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}
