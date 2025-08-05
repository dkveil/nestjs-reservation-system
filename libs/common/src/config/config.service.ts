import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Buffer } from 'node:buffer';
import * as crypto from 'node:crypto';

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

  createSignedMessage(payload: any, serviceName?: string): any {
    const serviceToken = this.get('INTER_SERVICE_SECRET');
    const timestamp = Date.now();

    if (!serviceToken) {
      throw new Error('INTER_SERVICE_SECRET not configured');
    }

    const fullPayload = serviceName
      ? { ...payload, service: serviceName }
      : payload;

    const dataToSign = JSON.stringify({
      ...fullPayload,
      timestamp,
    }, Object.keys(fullPayload).sort());

    const signature = crypto
      .createHmac('sha256', serviceToken)
      .update(dataToSign)
      .digest('hex');

    return {
      ...fullPayload,
      serviceToken,
      timestamp,
      signature,
    };
  }

  verifySignature(payload: any, timestamp: number, receivedSignature: string, serviceName?: string): boolean {
    const serviceToken = this.get('INTER_SERVICE_SECRET');

    if (!serviceToken) {
      return false;
    }

    const fullPayload = serviceName
      ? { ...payload, service: serviceName }
      : payload;

    const dataToSign = JSON.stringify({
      ...fullPayload,
      timestamp,
    }, Object.keys(fullPayload).sort());

    const expectedSignature = crypto
      .createHmac('sha256', serviceToken)
      .update(dataToSign)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex'),
    );
  }

  isTimestampValid(timestamp: number, maxAgeMinutes: number = 5): boolean {
    const now = Date.now();
    const maxAge = maxAgeMinutes * 60 * 1000;
    return Math.abs(now - timestamp) <= maxAge;
  }
}
