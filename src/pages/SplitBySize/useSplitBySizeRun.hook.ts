import { useCallback, useRef, useState } from 'react';
import type {
  SplitBySizeProgress,
  SplitBySizeWarningInfo,
  SplitOutputFile,
  SplitWorkerInput,
} from '@/models/split.model';
import { splitPdfBySize } from '@/services/pdf/pdfSplitBySize.service';
import { createCancelToken } from '@/services/worker/cancelToken.service';
import { isOperationCancelledError } from '@/utils/errors.util';
import type { SplitBySizeStep } from './SplitBySize.model';
import type { UseSplitBySizeRunResult } from './useSplitBySizeRun.model';

const BYTES_PER_MB = 1024 * 1024;

export function useSplitBySizeRun(): UseSplitBySizeRunResult {
  const [step, setStep] = useState<SplitBySizeStep>('configurar');
  const [progress, setProgress] = useState<SplitBySizeProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultFiles, setResultFiles] = useState<SplitOutputFile[] | null>(null);
  const [warnings, setWarnings] = useState<SplitBySizeWarningInfo[]>([]);
  const cancelTokenRef = useRef(createCancelToken());

  const run = useCallback(async (input: SplitWorkerInput, limitMB: number) => {
    setStep('processando');
    setError(null);
    setWarnings([]);
    cancelTokenRef.current = createCancelToken();
    try {
      const result = await splitPdfBySize(
        input,
        limitMB * BYTES_PER_MB,
        setProgress,
        cancelTokenRef.current,
      );
      setResultFiles(result.outputs);
      setWarnings(result.warnings);
      setStep('concluido');
    } catch (err) {
      setStep('configurar');
      if (!isOperationCancelledError(err)) {
        setError(err instanceof Error ? err.message : 'Não foi possível dividir o PDF por tamanho.');
      }
    }
  }, []);

  const cancel = useCallback(() => {
    cancelTokenRef.current.requestCancel();
  }, []);

  const reset = useCallback(() => {
    setStep('configurar');
    setProgress(null);
    setError(null);
    setResultFiles(null);
    setWarnings([]);
  }, []);

  return { step, progress, error, resultFiles, warnings, run, cancel, reset };
}
