import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '../config';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, ConfigService],
})
export class PrismaModule {}