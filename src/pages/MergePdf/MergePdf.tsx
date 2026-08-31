import { useMemo } from 'react';
import { Button } from '@/components/Button';
import { DropZone } from '@/components/DropZone';
import { ProgressBar } from '@/components/ProgressBar';
import { MergeFileList } from './components/MergeFileList';
import { MergeResult } from './components/MergeResult';
import { useMergeFileList } from './useMergeFileList.hook';
import { useMergeRun } from './useMergeRun.hook';

const MERGE_STAGE_LABELS: Record<string, string> = {
  preparando: 'Preparando arquivos…',
  'copiando-paginas': 'Copiando páginas…',
  salvando: 'Salvando PDF final…',
};

export function MergePdf() {
  const { files, addFiles, removeFile, reorderFiles } = useMergeFileList();
  const { step, progress, error, resultBlob, run, cancel, reset } = useMergeRun();

  const readyFiles = useMemo(() => files.filter((item) => item.status === 'pronto'), [files]);
  const canMerge = readyFiles.length >= 2 && files.every((item) => item.status !== 'carregando');

  const handleMerge = () => {
    run(readyFiles.map((item) => ({ id: item.id, name: item.name, file: item.file })));
  };

  if (step === 'concluido' && resultBlob) {
    return <MergeResult resultBlob={resultBlob} onRestart={reset} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Juntar PDFs</h1>
        <p className="mt-1 text-gray-600">Escolha dois ou mais PDFs e organize a ordem antes de juntar.</p>
      </div>

      <DropZone
        accept="application/pdf,.pdf"
        multiple
        label="Arraste PDFs aqui ou clique para escolher"
        helperText="Você pode escolher vários arquivos de uma vez"
        onFilesSelected={addFiles}
      />

      {files.length > 0 && (
        <MergeFileList files={files} onRemove={removeFile} onReorder={reorderFiles} />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {step === 'processando' && progress && (
        <ProgressBar
          label={MERGE_STAGE_LABELS[progress.stage] ?? 'Processando…'}
          current={progress.pagesProcessed}
          total={progress.totalPages}
          onCancel={cancel}
        />
      )}

      {step === 'organizar' && (
        <Button onClick={handleMerge} disabled={!canMerge}>
          Juntar {readyFiles.length} PDFs
        </Button>
      )}
    </div>
  );
}
