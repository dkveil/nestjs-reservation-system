import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsRepository extends AbstractRepository<Reservation> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  protected get model() {
    return this.prisma?.reservation;
  }

  protected get repositoryName() {
    return 'Reservations';
  }
}
