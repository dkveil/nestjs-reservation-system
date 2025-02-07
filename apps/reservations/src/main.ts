import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ZodFilter } from '@app/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(ReservationsModule, {
		snapshot: process.env.NODE_ENV === 'production',
	});
	app.useGlobalFilters(new ZodFilter());

	const config = new DocumentBuilder().setTitle('Reservations').setDescription('Reservations service').setVersion('1.0.0').build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(process.env.PORT ?? 3157);
}
bootstrap();
