import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { ConfigService } from '../config';

@Injectable()
export class InterServiceGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const data = context.switchToRpc().getData();
    const { serviceToken, timestamp, signature, service, ...payload } = data;

    if (!serviceToken || !timestamp || !signature) {
      throw new UnauthorizedException('Missing required authentication fields');
    }

    const expectedToken = this.configService.get('INTER_SERVICE_SECRET');

    if (serviceToken !== expectedToken) {
      throw new UnauthorizedException('Invalid service token');
    }

    if (!this.configService.isTimestampValid(timestamp)) {
      throw new UnauthorizedException('Request expired or from future');
    }

    if (!this.configService.verifySignature(payload, timestamp, signature, service)) {
      throw new UnauthorizedException('Invalid message signature');
    }

    return true;
  }
}
