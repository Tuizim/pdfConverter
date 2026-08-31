import { useCallback, useRef, useState } from 'react';
import type { MergeProgress, MergeWorkerInput } from '@/models/merge.model';
import { mergePdfFiles } from '@/services/pdf/pdfMerge.service';
import { createCancelToken } from '@/services/worker/cancelToken.service';
import { isOperationCancelledError } from '@/utils/errors.util';
import type { MergePdfStep } from './MergePdf.model';
import type { UseMergeRunResult } from './useMergeRun.model';

export function useMergeRun(): UseMergeRunResult {
  const [step, setStep] = useState<MergePdfStep>('organizar');
  const [progress, setProgress] = useState<MergeProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const cancelTokenRef = useRef(createCancelToken());

  const run = useCallback(async (inputs: MergeWorkerInput[]) => {
    setStep('processando');
    setError(null);
    cancelTokenRef.current = createCancelToken();
    try {
      const result = await mergePdfFiles(inputs, setProgress, cancelTokenRef.current);
      setResultBlob(new Blob([new Uint8Array(result.bytes)], { type: 'application/pdf' }));
      setStep('concluido');
    } catch (err) {
      setStep('organizar');
      if (!isOperationCancelledError(err)) {
        setError(err instanceof Error ? err.message : 'Não foi possível juntar os PDFs.');
      }
    }
  }, []);

  const cancel = useCallback(() => {
    cancelTokenRef.current.requestCancel();
  }, []);

  const reset = useCallback(() => {
    setStep('organizar');
    setProgress(null);
    setError(null);
    setResultBlob(null);
  }, []);

  return { step, progress, error, resultBlob, run, cancel, reset };
}
