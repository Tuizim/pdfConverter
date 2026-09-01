import { useState } from 'react';
import { DropZone } from '@/components/DropZone';
import { MultiFileResult } from '@/components/MultiFileResult';
import { ProgressBar } from '@/components/ProgressBar';
import { useLoadedPdfFile } from '@/hooks/useLoadedPdfFile.hook';
import type { PageGroupRequest } from '@/models/split.model';
import { buildZipFileName } from '@/utils/buildZipFileName.util';
import { isCompletedWithResult } from '@/utils/isCompletedWithResult.util';
import { isReadyToConfigure } from '@/utils/isReadyToConfigure.util';
import { SplitPagesConfigurator } from './components/SplitPagesConfigurator';
import type { SplitPagesMode } from './SplitByPages.model';
import { useSplitByPagesRun } from './useSplitByPagesRun.hook';

export function SplitByPages() {
  const { file, preview, status, errorMessage, loadFile, reset: resetFile } = useLoadedPdfFile();
  const { step, progress, error, resultFiles, run, cancel, reset: resetRun } = useSplitByPagesRun();
  const [mode, setMode] = useState<SplitPagesMode>('intervalos');
  const [submittedFileName, setSubmittedFileName] = useState('');

  const handleSubmit = (groups: PageGroupRequest[]) => {
    if (!file) return;
    setSubmittedFileName(file.name);
    run({ fileName: file.name, file }, groups);
  };

  const handleRestart = () => {
    resetRun();
    resetFile();
  };

  if (isCompletedWithResult(step, resultFiles)) {
    return (
      <MultiFileResult
        files={resultFiles}
        zipFileName={buildZipFileName(submittedFileName)}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Dividir por páginas
        </h1>
        <p className="mt-1 text-gray-600">Escolha um PDF e divida em vários arquivos.</p>
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
        <SplitPagesConfigurator
          file={file}
          preview={preview}
          mode={mode}
          onModeChange={setMode}
          onSubmit={handleSubmit}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {step === 'processando' && progress && (
        <ProgressBar
          label="Gerando arquivos…"
          current={progress.filesGenerated}
          total={progress.totalFiles}
          onCancel={cancel}
        />
      )}
    </div>
  );
}
