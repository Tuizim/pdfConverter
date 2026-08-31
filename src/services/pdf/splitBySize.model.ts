export interface SplitBySizeOptions {
  targetBytes: number;
  minFillRatio: number;
  maxProbes: number;
  avgBytesPerPageHint: number;
}

export type MeasurePagesFn = (startPage: number, pageCount: number) => Promise<number>;

export interface AcceptedChunk {
  startPage: number;
  pageCount: number;
  byteSize: number;
  oversized: boolean;
}

export type EmitChunkFn = (chunk: AcceptedChunk) => Promise<void>;

export interface SplitBySizeWarning {
  pageIndex: number;
  byteSize: number;
}

export interface SplitBySizeResult {
  chunks: AcceptedChunk[];
  warnings: SplitBySizeWarning[];
}
