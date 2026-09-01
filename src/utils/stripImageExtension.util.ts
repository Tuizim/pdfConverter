export function stripImageExtension(fileName: string): string {
  return fileName.replace(/\.(jpe?g)$/i, '');
}
