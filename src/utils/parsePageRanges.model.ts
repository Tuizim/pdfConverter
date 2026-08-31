export interface ParsePageRangesSuccess {
  success: true;
  groups: number[][];
}

export interface ParsePageRangesFailure {
  success: false;
  error: string;
}

export type ParsePageRangesResult = ParsePageRangesSuccess | ParsePageRangesFailure;
