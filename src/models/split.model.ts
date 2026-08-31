export interface SplitWorkerInput {
  fileName: string;
  file: File;
}

export interface SplitOutputFile {
  name: string;
  bytes: Uint8Array;
}

export interface PageGroupRequest {
  name: string;
  pages: number[];
}

export interface SplitByPagesProgress {
  filesGenerated: number;
  totalFiles: number;
}

export interface SplitBySizeProgress {
  pagesProcessed: number;
  totalPages: number;
  filesGenerated: number;
}

export interface SplitBySizeWarningInfo {
  pageNumber: number;
  byteSize: number;
}

export interface SplitBySizeRunResult {
  outputs: SplitOutputFile[];
  warnings: SplitBySizeWarningInfo[];
}
