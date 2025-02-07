import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ZodFilter } from '@app/common';

async function bootstrap() {
	const app = await NestFactory.create(ReservationsModule, {
		snapshot: process.env.NODE_ENV === 'production',
	});
	app.useGlobalFilters(new ZodFilter());
	await app.listen(process.env.PORT ?? 3157);
}
bootstrap();
