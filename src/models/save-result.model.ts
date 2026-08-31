export type SaveMethod = 'file-system-access' | 'download';

export interface SaveResult {
  method: SaveMethod;
  fileName: string;
}
