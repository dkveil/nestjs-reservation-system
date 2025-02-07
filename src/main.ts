import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodFilter } from '@app/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		snapshot: true,
	});
	app.useGlobalFilters(new ZodFilter());
	await app.listen(process.env.PORT ?? 3157);
}
bootstrap();
