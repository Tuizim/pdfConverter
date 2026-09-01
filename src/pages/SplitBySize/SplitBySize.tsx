import { useState } from 'react';
import { DropZone } from '@/components/DropZone';
import { MultiFileResult } from '@/components/MultiFileResult';
import { ProgressBar } from '@/components/ProgressBar';
import { useLoadedPdfFile } from '@/hooks/useLoadedPdfFile.hook';
import { buildZipFileName } from '@/utils/buildZipFileName.util';
import { isCompletedWithResult } from '@/utils/isCompletedWithResult.util';
import { isReadyToConfigure } from '@/utils/isReadyToConfigure.util';
import { SizeWarningsBanner } from './components/SizeWarningsBanner';
import { SplitSizeConfigurator } from './components/SplitSizeConfigurator';
import { useSplitBySizeRun } from './useSplitBySizeRun.hook';

export function SplitBySize() {
  const { file, preview, status, errorMessage, loadFile, reset: resetFile } = useLoadedPdfFile();
  const {
    step,
    progress,
    error,
    resultFiles,
    warnings,
    run,
    cancel,
    reset: resetRun,
  } = useSplitBySizeRun();
  const [submittedLimitMB, setSubmittedLimitMB] = useState(0);
  const [submittedFileName, setSubmittedFileName] = useState('');

  const handleSubmit = (limitMB: number) => {
    if (!file) return;
    setSubmittedLimitMB(limitMB);
    setSubmittedFileName(file.name);
    run({ fileName: file.name, file }, limitMB);
  };

  const handleRestart = () => {
    resetRun();
    resetFile();
  };

  if (isCompletedWithResult(step, resultFiles)) {
    return (
      <div className="flex flex-col gap-4">
        <SizeWarningsBanner warnings={warnings} limitMB={submittedLimitMB} />
        <MultiFileResult
          files={resultFiles}
          zipFileName={buildZipFileName(submittedFileName)}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Dividir por tamanho máximo
        </h1>
        <p className="mt-1 text-gray-600">
          Escolha um PDF e um limite de tamanho, cada arquivo gerado fica abaixo dele.
        </p>
      </div>

      {status === 'vazio' && (
        <DropZone
          accept="application/pdf,.pdf"
          label="Arraste um PDF aqui ou clique para escolher"
          onFilesSelected={loadFile}
        />
      )}

      {status === 'erro' && <p className="text-sm text-red-600">{errorMessage}</p>}

      {isReadyToConfigure(status, step) && preview && file && (
        <SplitSizeConfigurator file={file} preview={preview} onSubmit={handleSubmit} />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {step === 'processando' && progress && (
        <ProgressBar
          label={`Gerando arquivos… (${progress.filesGenerated} até agora)`}
          current={progress.pagesProcessed}
          total={progress.totalPages}
          onCancel={cancel}
        />
      )}
    </div>
  );
}
