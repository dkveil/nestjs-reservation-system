import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
	constructor(private configService: NestConfigService) {}

	get databaseUrl(): string {
		return this.configService.get<string>('DATABASE_URL')!;
	}
}
