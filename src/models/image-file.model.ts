export type ImageFileStatus = 'carregando' | 'pronto' | 'erro';

export interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  width: number | null;
  height: number | null;
  thumbnailUrl: string | null;
  status: ImageFileStatus;
  errorMessage: string | null;
}
