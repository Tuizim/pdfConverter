import { useCallback, useState } from 'react';
import { Button } from '@/components/Button';
import { CheckCircleIcon, DownloadIcon } from '@/components/icons';
import { saveOutputFile } from '@/services/storage/save.service';
import type { MergeResultProps } from './MergeResult.model';

function isUserAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function MergeResult({ resultBlob, fileName, onRestart }: MergeResultProps) {
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    setSaveError(null);
    try {
      await saveOutputFile(resultBlob, fileName);
    } catch (error) {
      if (isUserAbort(error)) return;
      console.error('[MergeResult] falha ao salvar arquivo', error);
      setSaveError('Não foi possível salvar o arquivo. Tente novamente.');
    }
  }, [resultBlob, fileName]);

  return (
    <div
      className="flex animate-fade-in flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-card sm:p-8"
      aria-live="polite"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircleIcon className="h-7 w-7" />
      </div>
      <p className="text-xl font-semibold text-gray-900">PDF gerado com sucesso</p>
      {saveError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{saveError}</p>
      )}
      <Button size="lg" className="w-full" onClick={handleDownload}>
        <DownloadIcon className="h-5 w-5" />
        Baixar PDF
      </Button>
      <button
        type="button"
        onClick={onRestart}
        className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-700"
      >
        Usar outros arquivos
      </button>
    </div>
  );
}
