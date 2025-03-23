import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { ConfigService } from '../config/';

@Injectable()
export class DatabaseService extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel> implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService) {
    super({
      datasourceUrl: configService.databaseUrl,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    this.$on('query', (e) => {
      this.log('query', `Query: ${e.query}`);
      this.log('query', `Params: ${e.params}`);
      this.log('query', `Duration: ${e.duration}ms`);
    });

    this.$on('error', (e) => {
      this.log('error', `Database error: ${e.message}`);
    });

    this.$on('info', (e) => {
      this.log('info', `Database info: ${e.message}`);
    });

    this.$on('warn', (e) => {
      this.log('warn', `Database warning: ${e.message}`);
    });

    this.$extends({
      query: {
        $allOperations: async ({ operation, model, args, query }) => {
          const startTime = Date.now();
          const result = await query(args);
          const endTime = Date.now();

          this.log('info', `${model}.${operation} took ${endTime - startTime}ms`);

          return result;
        },
      },
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
    this.log('info', 'Initializing database connection...');
    try {
      await this.$connect();
      this.log('info', 'Database connection established');
    }
    catch (error) {
      this.log('error', `Failed to connect to database: ${error.message}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.log('info', 'Closing database connection...');
    try {
      await this.$disconnect();
      this.log('info', 'Database connection closed');
    }
    catch (error) {
      this.log('error', `Error while disconnecting from database: ${error.message}`);
      throw error;
    }
  }

  async executeInTransaction<T>(operation: (tx: PrismaClient) => Promise<T>): Promise<T> {
    try {
      return await this.$transaction(operation);
    }
    catch (error) {
      this.log('error', `Transaction failed: ${error.message}`);
      throw error;
    }
  }

  async healthCheck() {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    }
    catch (error) {
      this.log('error', `Health check failed: ${error.message}`);
      return false;
    }
  }
}
