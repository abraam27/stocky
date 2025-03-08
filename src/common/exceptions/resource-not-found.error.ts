import { HttpStatus } from '@nestjs/common';

import { ErrorCode, HttpError } from './http.error';

export class ResourceNotFoundError extends HttpError {
  constructor(message?: string) {
    super(
      ErrorCode.ResourceNotFoundError,
      message ?? 'Resource not found',
      HttpStatus.BAD_REQUEST,
    );
  }
}
