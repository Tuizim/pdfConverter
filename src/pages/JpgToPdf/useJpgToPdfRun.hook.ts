import { useCallback, useRef, useState } from 'react';
import type { JpgToPdfProgress, JpgToPdfWorkerInput } from '@/models/jpg-to-pdf.model';
import { convertImagesToPdf } from '@/services/pdf/pdfFromImages.service';
import { createCancelToken } from '@/services/worker/cancelToken.service';
import { isOperationCancelledError } from '@/utils/errors.util';
import type { JpgToPdfStep } from './JpgToPdf.model';
import type { UseJpgToPdfRunResult } from './useJpgToPdfRun.model';

export function useJpgToPdfRun(): UseJpgToPdfRunResult {
  const [step, setStep] = useState<JpgToPdfStep>('organizar');
  const [progress, setProgress] = useState<JpgToPdfProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const cancelTokenRef = useRef(createCancelToken());

  const run = useCallback(async (inputs: JpgToPdfWorkerInput[]) => {
    setStep('processando');
    setError(null);
    cancelTokenRef.current = createCancelToken();
    try {
      const result = await convertImagesToPdf(inputs, setProgress, cancelTokenRef.current);
      setResultBlob(new Blob([new Uint8Array(result.bytes)], { type: 'application/pdf' }));
      setStep('concluido');
    } catch (err) {
      setStep('organizar');
      if (!isOperationCancelledError(err)) {
        setError(err instanceof Error ? err.message : 'Não foi possível converter as imagens.');
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
