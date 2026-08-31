import type { SaveResult } from '@/models/save-result.model';

const PDF_PICKER_TYPES: SaveFilePickerOptions['types'] = [
  { description: 'Documento PDF', accept: { 'application/pdf': ['.pdf'] } },
];

function isUserAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

async function saveViaFileSystemAccess(blob: Blob, fileName: string): Promise<SaveResult> {
  const handle = await window.showSaveFilePicker!({
    suggestedName: fileName,
    types: PDF_PICKER_TYPES,
  });
  const writable = await handle.createWritable();
  await blob.stream().pipeTo(writable);
  return { method: 'file-system-access', fileName };
}

function downloadViaBlob(blob: Blob, fileName: string): SaveResult {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return { method: 'download', fileName };
}

export async function saveOutputFile(blob: Blob, suggestedFileName: string): Promise<SaveResult> {
  if (typeof window.showSaveFilePicker === 'function') {
    try {
      return await saveViaFileSystemAccess(blob, suggestedFileName);
    } catch (error) {
      if (isUserAbort(error)) throw error;
      console.error('[save.service] falha ao salvar via File System Access API', error);
    }
  }
  return downloadViaBlob(blob, suggestedFileName);
}
