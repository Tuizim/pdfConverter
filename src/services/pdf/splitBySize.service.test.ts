import { describe, expect, it } from 'vitest';
import { planSplitBySize } from './splitBySize.service';
import type { AcceptedChunk, SplitBySizeOptions } from './splitBySize.model';

const BASE_OPTIONS: SplitBySizeOptions = {
  targetBytes: 0,
  minFillRatio: 0.8,
  maxProbes: 6,
  avgBytesPerPageHint: 0,
};

function withLimit(limitMB: number, avgBytesPerPageHint: number): SplitBySizeOptions {
  return {
    ...BASE_OPTIONS,
    targetBytes: limitMB * 1024 * 1024 * 0.95,
    avgBytesPerPageHint,
  };
}

function assertIntegrity(chunks: AcceptedChunk[], totalPages: number): void {
  expect(chunks.length).toBeGreaterThan(0);
  expect(chunks[0]!.startPage).toBe(0);

  let expectedNextStart = 0;
  for (const chunk of chunks) {
    expect(chunk.startPage).toBe(expectedNextStart);
    expect(chunk.pageCount).toBeGreaterThan(0);
    expectedNextStart += chunk.pageCount;
  }
  expect(expectedNextStart).toBe(totalPages);

  const pagesCovered = chunks.reduce((sum, chunk) => sum + chunk.pageCount, 0);
  expect(pagesCovered).toBe(totalPages);
}

async function runPlan(totalPages: number, options: SplitBySizeOptions, measure: (s: number, n: number) => Promise<number>) {
  const emitted: AcceptedChunk[] = [];
  let probeCount = 0;
  const countingMeasure = async (s: number, n: number) => {
    probeCount += 1;
    return measure(s, n);
  };
  const result = await planSplitBySize(totalPages, options, countingMeasure, async (chunk) => {
    emitted.push(chunk);
  });
  return { result, emitted, probeCount };
}

describe('planSplitBySize', () => {
  it('1. documento uniforme de texto puro divide em pedaços de tamanho parecido', async () => {
    const BYTES_PER_PAGE = 100_000;
    const totalPages = 50;
    const options = withLimit(1, BYTES_PER_PAGE);
    const measure = async (_start: number, n: number) => n * BYTES_PER_PAGE;

    const { result } = await runPlan(totalPages, options, measure);

    assertIntegrity(result.chunks, totalPages);
    expect(result.warnings).toHaveLength(0);

    const nonLastChunks = result.chunks.slice(0, -1);
    for (const chunk of nonLastChunks) {
      expect(chunk.byteSize).toBeLessThanOrEqual(options.targetBytes);
      expect(chunk.byteSize).toBeGreaterThanOrEqual(options.targetBytes * options.minFillRatio);
    }
  });

  it('2. página gigante isolada no meio do documento é isolada e avisada', async () => {
    const NORMAL_PAGE_BYTES = 20_000;
    const HUGE_PAGE_INDEX = 2;
    const HUGE_PAGE_BYTES = 80 * 1024 * 1024;
    const totalPages = 5;
    const options = withLimit(1, NORMAL_PAGE_BYTES);

    const measure = async (start: number, n: number) => {
      let size = 0;
      for (let i = start; i < start + n; i += 1) {
        size += i === HUGE_PAGE_INDEX ? HUGE_PAGE_BYTES : NORMAL_PAGE_BYTES;
      }
      return size;
    };

    const { result } = await runPlan(totalPages, options, measure);

    assertIntegrity(result.chunks, totalPages);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]!.pageIndex).toBe(HUGE_PAGE_INDEX);

    const hugeChunk = result.chunks.find((chunk) => chunk.startPage === HUGE_PAGE_INDEX)!;
    expect(hugeChunk.pageCount).toBe(1);
    expect(hugeChunk.oversized).toBe(true);

    for (const chunk of result.chunks) {
      if (!chunk.oversized) expect(chunk.byteSize).toBeLessThanOrEqual(options.targetBytes);
    }
  });

  it('3. fonte pesada compartilhada e reembutida em cada pedaço nunca estoura o limite', async () => {
    const FIXED_FONT_OVERHEAD = 400_000;
    const PER_PAGE_BYTES = 5_000;
    const totalPages = 200;
    // A média "ingênua" do documento original (fonte paga uma vez só) sugere
    // pedaços maiores do que cabem quando a fonte é reembutida em cada um.
    const naiveAvgPerPage = (FIXED_FONT_OVERHEAD + totalPages * PER_PAGE_BYTES) / totalPages;
    const options = withLimit(1, naiveAvgPerPage);

    const measure = async (_start: number, n: number) => FIXED_FONT_OVERHEAD + n * PER_PAGE_BYTES;

    const { result } = await runPlan(totalPages, options, measure);

    assertIntegrity(result.chunks, totalPages);
    for (const chunk of result.chunks) {
      expect(chunk.byteSize).toBeLessThanOrEqual(options.targetBytes);
    }
  });

  it('4. documento de 1 página menor que o limite gera um único arquivo sem sondagem', async () => {
    const PAGE_BYTES = 50_000;
    const totalPages = 1;
    const options = withLimit(5, PAGE_BYTES);
    const measure = async (_start: number, n: number) => n * PAGE_BYTES;

    const { result, probeCount } = await runPlan(totalPages, options, measure);

    assertIntegrity(result.chunks, totalPages);
    expect(result.chunks).toHaveLength(1);
    expect(result.warnings).toHaveLength(0);
    expect(probeCount).toBe(1);
  });

  it('5. limite absurdamente pequeno produz muitos arquivos com aviso, sem travar', async () => {
    const PAGE_BYTES = 500_000;
    const totalPages = 30;
    const options = withLimit(1 / 1024, PAGE_BYTES); // ~1 KB de limite
    const measure = async (_start: number, n: number) => n * PAGE_BYTES;

    const { result } = await runPlan(totalPages, options, measure);

    assertIntegrity(result.chunks, totalPages);
    expect(result.chunks.length).toBe(totalPages);
    expect(result.warnings.length).toBe(totalPages);
    expect(result.chunks.every((chunk) => chunk.oversized)).toBe(true);
  });

  it('6. integridade: cobre todas as páginas originais em ordem, sem sobreposição nem lacuna', async () => {
    const totalPages = 37;
    const options = withLimit(2, 30_000);
    const measure = async (_start: number, n: number) => n * 30_000;

    const { result } = await runPlan(totalPages, options, measure);

    assertIntegrity(result.chunks, totalPages);

    const seenPages = new Set<number>();
    for (const chunk of result.chunks) {
      for (let page = chunk.startPage; page < chunk.startPage + chunk.pageCount; page += 1) {
        expect(seenPages.has(page)).toBe(false);
        seenPages.add(page);
      }
    }
    expect(seenPages.size).toBe(totalPages);
  });

  it('nunca mede o mesmo par (start, pageCount) duas vezes', async () => {
    const totalPages = 40;
    const options = withLimit(1, 40_000);
    const measure = async (_start: number, n: number) => n * 40_000;

    const seenPairs = new Set<string>();
    const emitted: AcceptedChunk[] = [];
    const trackingMeasure = async (start: number, n: number) => {
      const key = `${start}:${n}`;
      expect(seenPairs.has(key)).toBe(false);
      seenPairs.add(key);
      return measure(start, n);
    };

    const result = await planSplitBySize(totalPages, options, trackingMeasure, async (chunk) => {
      emitted.push(chunk);
    });

    assertIntegrity(result.chunks, totalPages);
  });
});
