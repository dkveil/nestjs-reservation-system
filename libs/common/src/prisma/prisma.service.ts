import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { ConfigService } from '../config';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.databaseUrl,
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
      ],
    });
  }

  log(eventType: Prisma.LogLevel, message: string, data?: any) {
    const formattedMessage = data ? `${message} ${JSON.stringify(data, null, 2)}` : message;
    switch (eventType) {
      case 'query':
        this.logger.log(formattedMessage);
        break;
      case 'info':
        this.logger.verbose(formattedMessage);
        break;
      case 'warn':
        this.logger.warn(formattedMessage);
        break;
      case 'error':
        this.logger.error(formattedMessage);
        break;
      default:
        this.logger.log(formattedMessage);
    }
  }

  async onModuleInit() {
    this.$on('error', event => {
      this.logger.error(event);
    });
    this.$on('warn', event => {
      this.logger.warn(event);
    });
    this.$on('info', event => {
      this.logger.verbose(event);
    });
    this.$on('query', event => {
      this.logger.log(event);
    });

    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
