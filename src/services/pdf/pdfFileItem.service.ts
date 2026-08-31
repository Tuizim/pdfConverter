import type { PdfFileItem } from '@/models/pdf-file.model';
import { getPdfPreview } from '@/services/thumbnail/thumbnail.service';

export function createLoadingPdfFileItem(id: string, file: File): PdfFileItem {
  return {
    id,
    file,
    name: file.name,
    size: file.size,
    pageCount: null,
    thumbnailUrl: null,
    status: 'carregando',
    errorMessage: null,
  };
}

export async function loadPdfFileItem(id: string, file: File): Promise<PdfFileItem> {
  try {
    const preview = await getPdfPreview(file);
    return {
      id,
      file,
      name: file.name,
      size: file.size,
      pageCount: preview.pageCount,
      thumbnailUrl: preview.thumbnailUrl,
      status: 'pronto',
      errorMessage: null,
    };
  } catch (error) {
    return {
      id,
      file,
      name: file.name,
      size: file.size,
      pageCount: null,
      thumbnailUrl: null,
      status: 'erro',
      errorMessage: error instanceof Error ? error.message : 'Falha ao ler o arquivo.',
    };
  }
}
