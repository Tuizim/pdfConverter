import type { ImagePreview } from '@/models/image-preview.model';
import { THUMBNAIL_MAX_WIDTH_PX } from '@/constants/thumbnail.constants';

function renderBitmapToDataUrl(bitmap: ImageBitmap): string {
  const scale = Math.min(1, THUMBNAIL_MAX_WIDTH_PX / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Não foi possível preparar a miniatura da imagem.');
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

export async function getImagePreview(file: File): Promise<ImagePreview> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch (error) {
    console.error('[imageThumbnail.service] falha ao ler imagem', error);
    throw new Error(`Não foi possível ler "${file.name}", verifique se é uma imagem JPG válida.`);
  }
  try {
    return {
      width: bitmap.width,
      height: bitmap.height,
      thumbnailUrl: renderBitmapToDataUrl(bitmap),
    };
  } finally {
    bitmap.close();
  }
}
