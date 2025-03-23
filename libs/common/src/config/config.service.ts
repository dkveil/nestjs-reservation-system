import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService extends NestConfigService {
  constructor(configService: NestConfigService) {
    super(configService);
  }

  get databaseUrl(): string {
    return this.get<string>('DATABASE_URL')!;
  }

  get redisConnectData() {
    return {
      host: this.get<string>('REDIS_HOST')!,
      port: this.get<number>('REDIS_PORT')!,
      password: this.get<string>('REDIS_PASSWORD')!,
    };
  }

  get useRedis(): boolean {
    return this.get<string>('USE_REDIS') === 'true';
  }
}
