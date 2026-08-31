import type mupdfNamespace from 'mupdf';
import type { PDFDocument } from 'mupdf';
import {
  readFileFromOpfs,
  removeFileFromOpfs,
  writeFileToOpfs,
} from '@/services/storage/opfs.service';
import { OPFS_STAGING_THRESHOLD_BYTES } from '@/constants/storage.constants';

// mupdf faz `await` no próprio carregamento do WASM (arquivo de ~10MB) já no
// topo do módulo. Se importássemos isso estaticamente, `Comlink.expose`
// só rodaria (e só passaria a escutar mensagens) depois desse await —
// qualquer chamada RPC feita antes disso seria descartada em silêncio e
// ficaria pendurada para sempre. Import dinâmico evita isso: o módulo do
// worker termina de avaliar e registra o listener do Comlink na hora;
// o carregamento do mupdf só é esperado dentro da primeira chamada real.
let mupdfPromise: Promise<typeof mupdfNamespace> | null = null;
export function getMupdf(): Promise<typeof mupdfNamespace> {
  mupdfPromise ??= import('mupdf').then((mod) => mod.default);
  return mupdfPromise;
}

export async function resolveFileBytes(id: string, file: File): Promise<Uint8Array> {
  if (file.size <= OPFS_STAGING_THRESHOLD_BYTES) {
    return new Uint8Array(await file.arrayBuffer());
  }

  const stagedName = `pdf-input-${id}`;
  await writeFileToOpfs(stagedName, file);
  try {
    const staged = await readFileFromOpfs(stagedName);
    return new Uint8Array(await staged.arrayBuffer());
  } finally {
    await removeFileFromOpfs(stagedName);
  }
}

export async function openPdf(bytes: Uint8Array, fileName: string): Promise<PDFDocument> {
  const mupdf = await getMupdf();
  const document = mupdf.Document.openDocument(bytes, fileName);
  if (document.needsPassword()) {
    throw new Error(`"${fileName}" está protegido por senha — remova a senha antes de continuar.`);
  }
  const pdf = document.asPDF();
  if (!pdf) {
    throw new Error(`"${fileName}" não é um PDF válido.`);
  }
  return pdf;
}

// Constrói um novo PDFDocument só com as páginas pedidas (0-based, via
// graftPage) e serializa. measure() e a emissão final do arquivo usam esta
// mesma função — garante que o tamanho medido bate com o tamanho real salvo.
export async function buildAndSerializePages(
  srcDoc: PDFDocument,
  pageIndexes: number[],
): Promise<Uint8Array> {
  const mupdf = await getMupdf();
  const chunkDoc = new mupdf.PDFDocument();
  try {
    for (const pageIndex of pageIndexes) {
      chunkDoc.graftPage(chunkDoc.countPages(), srcDoc, pageIndex);
    }
    const buffer = chunkDoc.saveToBuffer();
    try {
      // Copia os bytes para fora do heap WASM antes de destruir o buffer —
      // asUint8Array() é uma view sobre memória que fica inválida assim que
      // o Buffer é destruído.
      return buffer.asUint8Array().slice();
    } finally {
      buffer.destroy();
    }
  } finally {
    chunkDoc.destroy();
  }
}

export function pageRange(startPage: number, pageCount: number): number[] {
  const pages: number[] = [];
  for (let i = 0; i < pageCount; i += 1) pages.push(startPage + i);
  return pages;
}
