export function isCompletedWithResult<T>(step: string, result: T | null): result is T {
  return step === 'concluido' && result !== null;
}
