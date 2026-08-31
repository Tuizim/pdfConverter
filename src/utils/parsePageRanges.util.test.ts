import { describe, expect, it } from 'vitest';
import { parsePageRanges } from './parsePageRanges.util';

describe('parsePageRanges', () => {
  it('separa por vírgula em grupos, com intervalos expandidos', () => {
    const result = parsePageRanges('1-3, 7, 10-12', 20);
    expect(result).toEqual({
      success: true,
      groups: [[1, 2, 3], [7], [10, 11, 12]],
    });
  });

  it('aceita espaços, ponto e vírgula e traço em qualquer combinação', () => {
    const result = parsePageRanges('1-3;7   10-12', 20);
    expect(result).toEqual({
      success: true,
      groups: [[1, 2, 3], [7], [10, 11, 12]],
    });
  });

  it('normaliza intervalo escrito ao contrário', () => {
    const result = parsePageRanges('5-3', 10);
    expect(result).toEqual({ success: true, groups: [[3, 4, 5]] });
  });

  it('rejeita página além do total, com mensagem específica', () => {
    const result = parsePageRanges('1-3, 25', 20);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('25');
  });

  it('rejeita token que não é número nem intervalo', () => {
    const result = parsePageRanges('abc', 10);
    expect(result.success).toBe(false);
  });

  it('rejeita entrada vazia', () => {
    const result = parsePageRanges('   ', 10);
    expect(result.success).toBe(false);
  });

  it('rejeita página zero ou negativa', () => {
    expect(parsePageRanges('0', 10).success).toBe(false);
    expect(parsePageRanges('-1', 10).success).toBe(false);
  });
});
