import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { User } from './users/entities';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}

  async login(user: User, response: Response) {
    const tokenPayload = {
      userId: user.id.toString(),
    };

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));

    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: `${this.configService.get('JWT_EXPIRATION')}s`,
    });

    response.cookie('Authentication', token, {
      expires,
      httpOnly: true,
    });
  }
}
