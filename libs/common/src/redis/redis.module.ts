import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { RedisService } from './redis.service';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
