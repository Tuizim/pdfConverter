import { useCallback, useState } from 'react';
import type { PdfFileItem } from '@/models/pdf-file.model';
import { createLoadingPdfFileItem, loadPdfFileItem } from '@/services/pdf/pdfFileItem.service';
import type { UseMergeFileListResult } from './useMergeFileList.model';

export function useMergeFileList(): UseMergeFileListResult {
  const [files, setFiles] = useState<PdfFileItem[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    for (const file of newFiles) {
      const id = crypto.randomUUID();
      setFiles((prev) => [...prev, createLoadingPdfFileItem(id, file)]);
      loadPdfFileItem(id, file).then((loaded) => {
        setFiles((prev) => prev.map((item) => (item.id === id ? loaded : item)));
      });
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const reorderFiles = useCallback((fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return prev;
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  return { files, addFiles, removeFile, reorderFiles, clearFiles };
}
