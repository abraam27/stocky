import { HttpException, HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  ValidationError = 'VALIDATION_ERROR',
  AuthorizationError = 'AUTHORIZATION_ERROR',
  ResourceNotFoundError = 'RESOURCE_NOT_FOUND_ERROR',
  RuntimeError = 'RUNTIME_ERROR',
  BadRequest = 'BAD_REQUEST',
}

export class HttpError extends HttpException {
  constructor(
    code: ErrorCode,
    message: string,
    statusCode?: HttpStatus,
    extra?: Record<string, any>,
  ) {
    super(
      {
        message,
        code,
        ...extra,
      },
      statusCode ?? HttpStatus.BAD_REQUEST,
    );
  }
}
