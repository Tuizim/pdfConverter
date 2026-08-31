export function computeFixedPageChunks(totalPages: number, pagesPerChunk: number): number[][] {
  const chunks: number[][] = [];
  for (let start = 1; start <= totalPages; start += pagesPerChunk) {
    const end = Math.min(start + pagesPerChunk - 1, totalPages);
    const pages: number[] = [];
    for (let page = start; page <= end; page += 1) pages.push(page);
    chunks.push(pages);
  }
  return chunks;
}
