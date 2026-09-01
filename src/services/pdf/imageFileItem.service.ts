import type { ImageFileItem } from '@/models/image-file.model';
import { getImagePreview } from '@/services/thumbnail/imageThumbnail.service';

export function createLoadingImageFileItem(id: string, file: File): ImageFileItem {
  return {
    id,
    file,
    name: file.name,
    size: file.size,
    width: null,
    height: null,
    thumbnailUrl: null,
    status: 'carregando',
    errorMessage: null,
  };
}

export async function loadImageFileItem(id: string, file: File): Promise<ImageFileItem> {
  try {
    const preview = await getImagePreview(file);
    return {
      id,
      file,
      name: file.name,
      size: file.size,
      width: preview.width,
      height: preview.height,
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
      width: null,
      height: null,
      thumbnailUrl: null,
      status: 'erro',
      errorMessage: error instanceof Error ? error.message : 'Falha ao ler o arquivo.',
    };
  }
}
