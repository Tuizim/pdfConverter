import type { PdfPreview } from '@/models/pdf-preview.model';

export type LoadedPdfFileStatus = 'vazio' | 'carregando' | 'pronto' | 'erro';

export interface UseLoadedPdfFileResult {
  file: File | null;
  preview: PdfPreview | null;
  status: LoadedPdfFileStatus;
  errorMessage: string | null;
  loadFile: (files: File[]) => void;
  reset: () => void;
}
