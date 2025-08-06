import type { RmqOptions } from '@nestjs/microservices';

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { ConfigService, ZodFilter } from '@app/common';

import { ReservationsModule } from './reservations.module';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

  const configService = app.get(ConfigService);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RABBITMQ_URL') as RmqUrl],
      noAck: false,
      queue: 'reservations',
    },
  });

  app.use(cookieParser());

  const isProduction = configService.get('NODE_ENV') === 'production';
  const port = Number(configService.get('RESERVATIONS_PORT', 3157));

  app.useGlobalFilters(new ZodFilter());

  if (isProduction) {
    app.enableShutdownHooks();
    app.enableCors({
      origin: configService.get('CORS_ORIGIN'),
      credentials: true,
    });
  }

  const config = new DocumentBuilder().setTitle('Reservations').setDescription('Reservations service').setVersion('1.0.0').build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
