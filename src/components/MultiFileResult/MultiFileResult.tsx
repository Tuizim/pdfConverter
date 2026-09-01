import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/Button';
import { CheckCircleIcon, DownloadIcon } from '@/components/icons';
import { saveOutputFile } from '@/services/storage/save.service';
import { createZipFromOutputs } from '@/services/storage/zip.service';
import { formatBytes } from '@/utils/formatBytes.util';
import { IndividualFilesList } from './IndividualFilesList';
import type { MultiFileResultProps } from './MultiFileResult.model';

function isUserAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function MultiFileResult({
  files,
  zipFileName,
  onRestart,
  restartLabel = 'Usar outro arquivo',
}: MultiFileResultProps) {
  const [error, setError] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);

  const totalBytes = useMemo(() => files.reduce((sum, file) => sum + file.bytes.length, 0), [files]);

  const handleDownloadOne = useCallback(
    async (index: number) => {
      setError(null);
      const file = files[index]!;
      try {
        await saveOutputFile(
          new Blob([new Uint8Array(file.bytes)], { type: 'application/pdf' }),
          file.name,
        );
      } catch (err) {
        if (!isUserAbort(err)) setError('Não foi possível salvar o arquivo. Tente novamente.');
      }
    },
    [files],
  );

  const handleDownloadZip = useCallback(async () => {
    setError(null);
    setZipping(true);
    try {
      const zipBlob = await createZipFromOutputs(files);
      await saveOutputFile(zipBlob, zipFileName);
    } catch (err) {
      if (!isUserAbort(err)) setError('Não foi possível gerar o ZIP. Tente novamente.');
    } finally {
      setZipping(false);
    }
  }, [files, zipFileName]);

  return (
    <div
      className="flex animate-fade-in flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-card sm:p-8"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircleIcon className="h-7 w-7" />
        </div>
        <p className="text-xl font-semibold text-gray-900">
          {files.length} arquivo{files.length === 1 ? '' : 's'} gerado{files.length === 1 ? '' : 's'}
        </p>
        <p className="text-sm text-gray-500">{formatBytes(totalBytes)} no total</p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600">{error}</p>
      )}

      <Button size="lg" className="w-full" onClick={handleDownloadZip} disabled={zipping}>
        <DownloadIcon className="h-5 w-5" />
        {zipping ? 'Gerando ZIP…' : 'Baixar tudo (.zip)'}
      </Button>

      <IndividualFilesList files={files} onDownloadOne={handleDownloadOne} />

      <button
        type="button"
        onClick={onRestart}
        className="text-center text-sm font-medium text-gray-400 transition-colors hover:text-gray-700"
      >
        {restartLabel}
      </button>
    </div>
  );
}
