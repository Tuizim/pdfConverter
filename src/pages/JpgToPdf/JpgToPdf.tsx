import { useMemo, useState } from 'react';
import { Button } from '@/components/Button';
import { DropZone } from '@/components/DropZone';
import { ProgressBar } from '@/components/ProgressBar';
import { stripImageExtension } from '@/utils/stripImageExtension.util';
import { ImageFileList } from './components/ImageFileList';
import { JpgToPdfResult } from './components/JpgToPdfResult';
import { useImageFileList } from './useImageFileList.hook';
import { useJpgToPdfRun } from './useJpgToPdfRun.hook';

const JPG_TO_PDF_STAGE_LABELS: Record<string, string> = {
  preparando: 'Preparando imagens…',
  'inserindo-imagens': 'Adicionando imagens ao PDF…',
  salvando: 'Salvando PDF final…',
};

export function JpgToPdf() {
  const { files, addFiles, removeFile, reorderFiles, clearFiles } = useImageFileList();
  const { step, progress, error, resultBlob, run, cancel, reset } = useJpgToPdfRun();
  const [resultFileName, setResultFileName] = useState('imagens-convertidas.pdf');

  const readyFiles = useMemo(() => files.filter((item) => item.status === 'pronto'), [files]);
  const canConvert = readyFiles.length >= 1 && files.every((item) => item.status !== 'carregando');

  const handleConvert = () => {
    setResultFileName(`${stripImageExtension(readyFiles[0]!.name)}-convertido.pdf`);
    run(readyFiles.map((item) => ({ id: item.id, name: item.name, file: item.file })));
  };

  const handleRestart = () => {
    reset();
    clearFiles();
  };

  if (step === 'concluido' && resultBlob) {
    return (
      <JpgToPdfResult resultBlob={resultBlob} fileName={resultFileName} onRestart={handleRestart} />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          JPG para PDF
        </h1>
        <p className="mt-1 text-gray-600">
          Escolha uma ou mais imagens JPG e organize a ordem antes de converter.
        </p>
      </div>

      <DropZone
        accept="image/jpeg,.jpg,.jpeg"
        multiple
        label="Arraste imagens JPG aqui ou clique para escolher"
        helperText="Você pode escolher vários arquivos de uma vez"
        onFilesSelected={addFiles}
      />

      {files.length > 0 && (
        <ImageFileList files={files} onRemove={removeFile} onReorder={reorderFiles} />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {step === 'processando' && progress && (
        <ProgressBar
          label={JPG_TO_PDF_STAGE_LABELS[progress.stage] ?? 'Processando…'}
          current={progress.imagesProcessed}
          total={progress.totalImages}
          onCancel={cancel}
        />
      )}

      {step === 'organizar' && (
        <Button size="lg" onClick={handleConvert} disabled={!canConvert}>
          Converter {readyFiles.length} imagem(s)
        </Button>
      )}
    </div>
  );
}
