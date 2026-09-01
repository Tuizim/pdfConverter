import { stripPdfExtension } from './stripPdfExtension.util';

export function buildZipFileName(originalFileName: string | undefined): string {
  return `${stripPdfExtension(originalFileName ?? 'documento')}.zip`;
}
