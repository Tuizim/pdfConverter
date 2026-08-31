import { BlobWriter, Uint8ArrayReader, ZipWriter } from '@zip.js/zip.js';
import type { SplitOutputFile } from '@/models/split.model';

export async function createZipFromOutputs(files: SplitOutputFile[]): Promise<Blob> {
  const zipWriter = new ZipWriter(new BlobWriter('application/zip'));
  for (const file of files) {
    await zipWriter.add(file.name, new Uint8ArrayReader(file.bytes));
  }
  return zipWriter.close();
}
