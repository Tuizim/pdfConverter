export type MergeStage = 'preparando' | 'copiando-paginas' | 'salvando';

export interface MergeProgress {
  stage: MergeStage;
  filesProcessed: number;
  totalFiles: number;
  pagesProcessed: number;
  totalPages: number;
}

export interface MergeWorkerInput {
  id: string;
  name: string;
  file: File;
}

export interface MergeWorkerResult {
  bytes: Uint8Array;
  pageCount: number;
}
