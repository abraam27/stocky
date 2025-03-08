export class IllegalStateException extends Error {
  constructor(message: string) {
    super(`[IllegalStateException]: ${message}`);
  }
}
