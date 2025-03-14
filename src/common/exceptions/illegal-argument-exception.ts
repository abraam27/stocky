export class IllegalArgumentException extends Error {
  constructor(message: string) {
    super(`[IllegalArgumentException]: ${message}`);
  }
}
