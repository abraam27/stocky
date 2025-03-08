import { HttpStatus } from '@nestjs/common';

import { ErrorCode, HttpError } from './http.error';

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(
      ErrorCode.BadRequest,
      message ?? 'Undefined Error',
      HttpStatus.BAD_REQUEST,
    );
  }
}
