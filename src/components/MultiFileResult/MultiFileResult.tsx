import { useCallback, useState } from 'react';
import { Button } from '@/components/Button';
import { saveOutputFile } from '@/services/storage/save.service';
import { createZipFromOutputs } from '@/services/storage/zip.service';
import { formatBytes } from '@/utils/formatBytes.util';
import type { MultiFileResultProps } from './MultiFileResult.model';

function isUserAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function MultiFileResult({ files, zipFileName, onRestart }: MultiFileResultProps) {
  const [error, setError] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);

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
    <div className="flex flex-col gap-4 rounded-xl border bg-white p-6" aria-live="polite">
      <p className="text-lg font-medium text-gray-900">{files.length} arquivos gerados.</p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="flex flex-col gap-2">
        {files.map((file, index) => (
          <li
            key={file.name}
            className="flex items-center justify-between gap-3 rounded-lg border p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(file.bytes.length)}</p>
            </div>
            <Button variant="secondary" onClick={() => handleDownloadOne(index)}>
              Baixar
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex gap-3">
        <Button onClick={handleDownloadZip} disabled={zipping}>
          {zipping ? 'Gerando ZIP…' : 'Baixar todos em ZIP'}
        </Button>
        <Button variant="secondary" onClick={onRestart}>
          Recomeçar
        </Button>
      </div>
    </div>
  );
}
