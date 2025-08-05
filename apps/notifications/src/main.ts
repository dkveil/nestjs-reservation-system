import type { MicroserviceOptions } from '@nestjs/microservices';

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';

import { ConfigService, ZodFilter } from '@app/common';

import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(configService.get('NOTIFICATIONS_TCP_PORT', 3002)),
    },
  });

  app.use(cookieParser());

  const isProduction = configService.get('NODE_ENV') === 'production';
  const port = Number(configService.get('NOTIFICATIONS_PORT', 3159));

  app.useGlobalFilters(new ZodFilter());

  if (isProduction) {
    app.enableShutdownHooks();
    app.enableCors({
      origin: configService.get('CORS_ORIGIN'),
      credentials: true,
    });
  }

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
