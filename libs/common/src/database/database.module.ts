import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule } from '../config';

@Module({
	imports: [ConfigModule],
	exports: [DatabaseService],
	providers: [DatabaseService],
})
export class DatabaseModule {}
