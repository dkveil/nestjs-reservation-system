import { Module } from '@nestjs/common';

import { DatabaseModule, RedisModule } from '@app/common';

import { ReservationsController } from './reservations.controller';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
