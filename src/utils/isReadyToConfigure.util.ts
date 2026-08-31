import type { LoadedPdfFileStatus } from '@/hooks/useLoadedPdfFile.model';

export function isReadyToConfigure(status: LoadedPdfFileStatus, step: string): boolean {
  return status === 'pronto' && step === 'configurar';
}
