import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
	constructor(private configService: NestConfigService) {}

	get databaseUrl(): string {
		return this.configService.get<string>('DATABASE_URL')!;
	}

	get redisConnectData() {
		return {
			host: this.configService.get<string>('REDIS_HOST')!,
			port: this.configService.get<number>('REDIS_PORT')!,
			password: this.configService.get<string>('REDIS_PASSWORD')!,
		};
	}
}
