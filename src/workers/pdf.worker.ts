/// <reference lib="webworker" />
import * as Comlink from 'comlink';
import { extractPageGroups } from './operations/extractPageGroups.operation';
import { jpgsToPdf } from './operations/jpgToPdf.operation';
import { mergePdfs } from './operations/mergePdfs.operation';
import { splitBySize } from './operations/splitBySize.operation';
import type { PdfWorkerApi } from './pdf.worker.model';

Comlink.expose({
  mergePdfs,
  extractPageGroups,
  splitBySize,
  jpgsToPdf,
} satisfies PdfWorkerApi);
