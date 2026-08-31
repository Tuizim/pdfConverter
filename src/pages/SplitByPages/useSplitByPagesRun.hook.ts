import { useCallback, useRef, useState } from 'react';
import type {
  PageGroupRequest,
  SplitByPagesProgress,
  SplitOutputFile,
  SplitWorkerInput,
} from '@/models/split.model';
import { extractPageGroupsFromPdf } from '@/services/pdf/pdfSplitByPages.service';
import { createCancelToken } from '@/services/worker/cancelToken.service';
import { isOperationCancelledError } from '@/utils/errors.util';
import type { SplitByPagesStep } from './SplitByPages.model';
import type { UseSplitByPagesRunResult } from './useSplitByPagesRun.model';

export function useSplitByPagesRun(): UseSplitByPagesRunResult {
  const [step, setStep] = useState<SplitByPagesStep>('configurar');
  const [progress, setProgress] = useState<SplitByPagesProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultFiles, setResultFiles] = useState<SplitOutputFile[] | null>(null);
  const cancelTokenRef = useRef(createCancelToken());

  const run = useCallback(async (input: SplitWorkerInput, groups: PageGroupRequest[]) => {
    setStep('processando');
    setError(null);
    cancelTokenRef.current = createCancelToken();
    try {
      const files = await extractPageGroupsFromPdf(
        input,
        groups,
        setProgress,
        cancelTokenRef.current,
      );
      setResultFiles(files);
      setStep('concluido');
    } catch (err) {
      setStep('configurar');
      if (!isOperationCancelledError(err)) {
        setError(err instanceof Error ? err.message : 'Não foi possível dividir o PDF.');
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
  }, []);

  return { step, progress, error, resultFiles, run, cancel, reset };
}
