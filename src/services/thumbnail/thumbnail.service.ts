import { GlobalWorkerOptions, getDocument, type PDFPageProxy } from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';
import type { PdfPreview } from '@/models/pdf-preview.model';
import type { PdfThumbnailSource } from '@/models/pdf-thumbnail-source.model';
import { THUMBNAIL_MAX_WIDTH_PX } from '@/constants/thumbnail.constants';

GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

async function renderPageToDataUrl(page: PDFPageProxy): Promise<string> {
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = THUMBNAIL_MAX_WIDTH_PX / baseViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const canvasContext = canvas.getContext('2d');
  if (!canvasContext) {
    throw new Error('Não foi possível preparar a miniatura da página.');
  }

  await page.render({ canvasContext, viewport }).promise;
  return canvas.toDataURL('image/png');
}

// pdfjs-dist já faz seu próprio parsing em um worker interno; usar uma URL de
// blob evita ler o arquivo inteiro na thread principal (o navegador cuida do
// streaming do blob), então não precisamos de outro worker aqui.
export async function getPdfPreview(file: File): Promise<PdfPreview> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const pdf = await getDocument({ url: objectUrl }).promise;
    try {
      const page = await pdf.getPage(1);
      return { pageCount: pdf.numPages, thumbnailUrl: await renderPageToDataUrl(page) };
    } finally {
      await pdf.destroy();
    }
  } catch (error) {
    console.error('[thumbnail.service] falha ao gerar miniatura', error);
    throw new Error(`Não foi possível ler "${file.name}", verifique se é um PDF válido.`);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// Mantém o documento pdfjs aberto entre chamadas para uma grade de miniaturas
// sob demanda: abrir o documento uma vez só e renderizar páginas conforme
// elas entram na tela (via IntersectionObserver no componente), em vez de
// reabrir o PDF ou renderizar tudo de uma vez.
export async function openPdfThumbnailSource(file: File): Promise<PdfThumbnailSource> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const pdf = await getDocument({ url: objectUrl }).promise;
    return {
      pageCount: pdf.numPages,
      renderPage: async (pageNumber: number) => {
        const page = await pdf.getPage(pageNumber);
        return renderPageToDataUrl(page);
      },
      dispose: () => {
        void pdf.destroy();
        URL.revokeObjectURL(objectUrl);
      },
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    console.error('[thumbnail.service] falha ao abrir PDF para miniaturas', error);
    throw new Error(`Não foi possível ler "${file.name}", verifique se é um PDF válido.`);
  }
}
