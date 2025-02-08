import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { envSchema } from './env.schema';

@Module({
	imports: [
		NestConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
			ignoreEnvFile: process.env.NODE_ENV === 'production',
			validate: env => envSchema.parse(env),
		}),
	],

	providers: [ConfigService],
	exports: [ConfigService],
})
export class ConfigModule {}
