import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService, ZodFilter } from '@app/common';

import { ReservationsModule } from './reservations.module';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);

  const configService = app.get(ConfigService);
  const isProduction = configService.get('NODE_ENV') === 'production';
  const port = Number(configService.get('PORT', 3157));

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

  await app.listen(port);
}
bootstrap();
