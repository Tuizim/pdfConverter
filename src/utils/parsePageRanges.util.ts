import type { ParsePageRangesResult } from './parsePageRanges.model';

const GROUP_SEPARATOR = /[,;\s]+/;

function parseSinglePage(token: string, totalPages: number): number | string {
  const page = Number(token);
  if (!Number.isInteger(page)) return `"${token}" não é um número de página válido.`;
  if (page < 1 || page > totalPages) {
    return `A página ${page} não existe — o documento tem ${totalPages} páginas.`;
  }
  return page;
}

function parseGroup(token: string, totalPages: number): number[] | string {
  if (!token.includes('-')) {
    const page = parseSinglePage(token, totalPages);
    return typeof page === 'string' ? page : [page];
  }

  const parts = token.split('-');
  if (parts.length !== 2) return `"${token}" não é um intervalo válido.`;

  const start = parseSinglePage(parts[0]!, totalPages);
  if (typeof start === 'string') return start;
  const end = parseSinglePage(parts[1]!, totalPages);
  if (typeof end === 'string') return end;

  const [from, to] = start <= end ? [start, end] : [end, start];
  const pages: number[] = [];
  for (let page = from; page <= to; page += 1) pages.push(page);
  return pages;
}

export function parsePageRanges(input: string, totalPages: number): ParsePageRangesResult {
  const tokens = input
    .trim()
    .split(GROUP_SEPARATOR)
    .filter((token) => token.length > 0);

  if (tokens.length === 0) {
    return { success: false, error: 'Digite ao menos uma página ou intervalo, por exemplo: 1-3, 7' };
  }

  const groups: number[][] = [];
  for (const token of tokens) {
    const group = parseGroup(token, totalPages);
    if (typeof group === 'string') return { success: false, error: group };
    groups.push(group);
  }

  return { success: true, groups };
}
