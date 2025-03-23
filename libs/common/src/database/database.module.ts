import { Module } from '@nestjs/common';

import { ConfigModule } from '../config';
import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule],
  exports: [DatabaseService],
  providers: [DatabaseService],
})
export class DatabaseModule {}
