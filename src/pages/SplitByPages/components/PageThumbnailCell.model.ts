export interface PageThumbnailCellProps {
  pageNumber: number;
  selected: boolean;
  onToggle: (pageNumber: number) => void;
  renderPage: (pageNumber: number) => Promise<string>;
}
