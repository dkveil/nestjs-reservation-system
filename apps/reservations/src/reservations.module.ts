import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, RedisModule } from '@app/common';
import { ReservationsRepository } from './reservations.repository';

@Module({
	imports: [DatabaseModule, RedisModule],
	controllers: [ReservationsController],
	providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
