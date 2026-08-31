import { useCallback, useState } from 'react';
import { Button } from '@/components/Button';
import { saveOutputFile } from '@/services/storage/save.service';
import type { MergeResultProps } from './MergeResult.model';

function isUserAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

export function MergeResult({ resultBlob, onRestart }: MergeResultProps) {
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    setSaveError(null);
    try {
      await saveOutputFile(resultBlob, 'documento-unido.pdf');
    } catch (error) {
      if (isUserAbort(error)) return;
      console.error('[MergeResult] falha ao salvar arquivo', error);
      setSaveError('Não foi possível salvar o arquivo. Tente novamente.');
    }
  }, [resultBlob]);

  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border bg-white p-6" aria-live="polite">
      <p className="text-lg font-medium text-gray-900">PDF gerado com sucesso.</p>
      {saveError && <p className="text-sm text-red-600">{saveError}</p>}
      <div className="flex gap-3">
        <Button onClick={handleDownload}>Baixar PDF</Button>
        <Button variant="secondary" onClick={onRestart}>
          Recomeçar
        </Button>
      </div>
    </div>
  );
}
