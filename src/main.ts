import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppConfigs } from './app-configs';
import { AppModule } from './app.module';

async function bootstrap() {
  const startTime = new Date().getTime();
  const app = await NestFactory.create(AppModule);

  /** start listening on port */
  await app.enableShutdownHooks().listen(AppConfigs.appPort);
  Logger.log(
    `App Listening on ${AppConfigs.appPort}, bootstrapped in ${new Date().getTime() - startTime} ms`,
    'bootstrap',
  );
}

bootstrap();
