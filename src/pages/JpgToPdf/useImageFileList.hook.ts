import { useCallback, useState } from 'react';
import type { ImageFileItem } from '@/models/image-file.model';
import { createLoadingImageFileItem, loadImageFileItem } from '@/services/pdf/imageFileItem.service';
import type { UseImageFileListResult } from './useImageFileList.model';

export function useImageFileList(): UseImageFileListResult {
  const [files, setFiles] = useState<ImageFileItem[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    for (const file of newFiles) {
      const id = crypto.randomUUID();
      setFiles((prev) => [...prev, createLoadingImageFileItem(id, file)]);
      loadImageFileItem(id, file).then((loaded) => {
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
