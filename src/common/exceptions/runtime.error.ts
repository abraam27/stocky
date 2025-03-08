import { HttpStatus } from '@nestjs/common';

import { ErrorCode, HttpError } from './http.error';

export class RuntimeError extends HttpError {
  constructor(message?: string) {
    super(
      ErrorCode.RuntimeError,
      message ?? 'Undefined Error',
      HttpStatus.BAD_REQUEST,
    );
  }
}
