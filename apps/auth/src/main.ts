import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { ConfigService, ZodFilter } from '@app/common';

import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const isProduction = configService.get('NODE_ENV') === 'production';
  const port = Number(configService.get('AUTH_PORT', 3158));

  app.useGlobalFilters(new ZodFilter());

  if (isProduction) {
    app.enableShutdownHooks();
    app.enableCors({
      origin: configService.get('CORS_ORIGIN'),
      credentials: true,
    });
  }

  await app.listen(port);
}
bootstrap();
