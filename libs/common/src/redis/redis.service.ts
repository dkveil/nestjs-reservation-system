import { Injectable, OnModuleInit, OnModuleDestroy, Inject, Logger } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.module';
import { Redis } from 'ioredis';
import { ConfigService } from '@app/common';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(RedisService.name);
	private isConnected = false;
	private client: Redis;

	constructor(private configService: ConfigService) {}

	async onModuleInit() {
		try {
			const { host, port, password } = this.configService.redisConnectData;

			this.client = new Redis({
				host,
				port,
				password,
			});

			const pong = await this.client.ping();
			if (pong === 'PONG') {
				this.isConnected = true;
				this.logger.log('Successfully connected to Redis');
			}
		} catch (error) {
			this.logger.error('Failed to connect to Redis:', error);
			throw error;
		}
	}

	async onModuleDestroy() {
		if (this.isConnected) {
			try {
				await this.client.quit();
				this.isConnected = false;
				this.logger.log('Successfully closed Redis connection');
			} catch (error) {
				this.logger.error('Error while closing Redis connection:', error);
				throw error;
			}
		}
	}

	async get(key: string): Promise<string | null> {
		try {
			return await this.client.get(key);
		} catch (error) {
			this.logger.error(`Error getting key ${key}:`, error);
			throw error;
		}
	}

	async set(key: string, value: string, ttl?: number): Promise<'OK'> {
		try {
			if (ttl) {
				return await this.client.set(key, value, 'EX', ttl);
			}
			return await this.client.set(key, value);
		} catch (error) {
			this.logger.error(`Error setting key ${key}:`, error);
			throw error;
		}
	}
}
