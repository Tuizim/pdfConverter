import { useState } from 'react';
import { Button } from '@/components/Button';
import { ChevronDownIcon } from '@/components/icons';
import { cn } from '@/utils/cn.util';
import { formatBytes } from '@/utils/formatBytes.util';
import type { IndividualFilesListProps } from './IndividualFilesList.model';

export function IndividualFilesList({ files, onDownloadOne }: IndividualFilesListProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800"
      >
        {expanded ? 'Ocultar arquivos individuais' : 'Ou baixe cada arquivo separadamente'}
        <ChevronDownIcon className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <ul className="flex flex-col gap-2 border-t border-gray-100 pt-3">
          {files.map((file, index) => (
            <li
              key={file.name}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{formatBytes(file.bytes.length)}</p>
              </div>
              <Button variant="secondary" onClick={() => onDownloadOne(index)}>
                Baixar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
