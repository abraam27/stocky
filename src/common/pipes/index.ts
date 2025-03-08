import { ValidationPipe } from '@nestjs/common';
import { ValidationException } from '../exceptions';

export const AppLevelValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (e) => new ValidationException(e),
  });
