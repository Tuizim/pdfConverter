export type JpgToPdfStage = 'preparando' | 'inserindo-imagens' | 'salvando';

export interface JpgToPdfProgress {
  stage: JpgToPdfStage;
  imagesProcessed: number;
  totalImages: number;
}

export interface JpgToPdfWorkerInput {
  id: string;
  name: string;
  file: File;
}

export interface JpgToPdfWorkerResult {
  bytes: Uint8Array;
  pageCount: number;
}
