import { Module, Global } from '@nestjs/common';
import { ConfigService, ConfigModule } from '../config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Module({
	imports: [ConfigModule],
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
