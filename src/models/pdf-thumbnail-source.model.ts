export interface PdfThumbnailSource {
  pageCount: number;
  renderPage: (pageNumber: number) => Promise<string>;
  dispose: () => void;
}
