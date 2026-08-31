import { useCallback, useState } from 'react';
import type { PdfPreview } from '@/models/pdf-preview.model';
import { getPdfPreview } from '@/services/thumbnail/thumbnail.service';
import type { LoadedPdfFileStatus, UseLoadedPdfFileResult } from './useLoadedPdfFile.model';

export function useLoadedPdfFile(): UseLoadedPdfFileResult {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PdfPreview | null>(null);
  const [status, setStatus] = useState<LoadedPdfFileStatus>('vazio');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFile = useCallback((files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(null);
    setStatus('carregando');
    setErrorMessage(null);

    getPdfPreview(selected)
      .then((loadedPreview) => {
        setPreview(loadedPreview);
        setStatus('pronto');
      })
      .catch((error: unknown) => {
        setStatus('erro');
        setErrorMessage(error instanceof Error ? error.message : 'Falha ao ler o arquivo.');
      });
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setStatus('vazio');
    setErrorMessage(null);
  }, []);

  return { file, preview, status, errorMessage, loadFile, reset };
}
