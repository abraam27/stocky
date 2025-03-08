import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { ErrorCode, HttpError } from './http.error';

function parseErrors(errors: ValidationError[], parent = '') {
  let parsedErrors: Record<string, Array<string>> = {};
  errors.forEach((e: any) => {
    if (e.children && e.children.length) {
      parsedErrors = {
        ...parsedErrors,
        ...parseErrors(e.children, e.property + '.'),
      };
    } else {
      parsedErrors[parent + e.property] = [
        e.constraints[Object.keys(e.constraints)[0]],
      ];
    }
  });
  return parsedErrors;
}

export class ValidationException extends HttpError {
  static fromSingleError(field: string, error: string) {
    const verror: ValidationError = {
      property: field,
      constraints: { [field]: error },
      target: {},
      value: null,
      children: [],
    };

    return new ValidationException([
      Object.assign(new ValidationError(), verror),
    ]);
  }
  constructor(vErrors: ValidationError[]) {
    super(
      ErrorCode.ValidationError,
      'Error in provided Data',
      HttpStatus.UNPROCESSABLE_ENTITY,
      {
        errors: parseErrors(vErrors),
      },
    );
  }
}
