import { HttpStatus } from '@nestjs/common';

import { ErrorCode, HttpError } from './http.error';

export class AuthorizationError extends HttpError {
  constructor(message?: string) {
    super(
      ErrorCode.AuthorizationError,
      message ?? 'Not allowed',
      HttpStatus.FORBIDDEN,
    );
  }
}
