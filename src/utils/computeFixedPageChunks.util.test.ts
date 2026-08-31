import { describe, expect, it } from 'vitest';
import { computeFixedPageChunks } from './computeFixedPageChunks.util';

describe('computeFixedPageChunks', () => {
  it('gera ceil(total/N) grupos, o último menor quando não divide exato', () => {
    const chunks = computeFixedPageChunks(10, 3);
    expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
  });

  it('gera um único grupo quando N >= total de páginas', () => {
    const chunks = computeFixedPageChunks(5, 10);
    expect(chunks).toEqual([[1, 2, 3, 4, 5]]);
  });

  it('divide exatamente quando N é múltiplo do total', () => {
    const chunks = computeFixedPageChunks(9, 3);
    expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  });
});
