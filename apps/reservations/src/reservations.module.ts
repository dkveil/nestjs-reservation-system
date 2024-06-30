import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { PrismaModule, LoggerModule } from '@app/common';
import { ReservationsRepository } from './reservations.repository';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule {}
