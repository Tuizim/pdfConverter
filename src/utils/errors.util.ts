export class OperationCancelledError extends Error {
  constructor() {
    super('Operação cancelada pelo usuário.');
    this.name = 'OperationCancelledError';
  }
}

export function isOperationCancelledError(error: unknown): error is OperationCancelledError {
  return error instanceof Error && error.name === 'OperationCancelledError';
}
