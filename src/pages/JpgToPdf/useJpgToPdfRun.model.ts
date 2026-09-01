import type { JpgToPdfProgress, JpgToPdfWorkerInput } from '@/models/jpg-to-pdf.model';
import type { JpgToPdfStep } from './JpgToPdf.model';

export interface UseJpgToPdfRunResult {
  step: JpgToPdfStep;
  progress: JpgToPdfProgress | null;
  error: string | null;
  resultBlob: Blob | null;
  run: (inputs: JpgToPdfWorkerInput[]) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}
