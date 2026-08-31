export type PdfFileStatus = 'carregando' | 'pronto' | 'erro';

export interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number | null;
  thumbnailUrl: string | null;
  status: PdfFileStatus;
  errorMessage: string | null;
}
