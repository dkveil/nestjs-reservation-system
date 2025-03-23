import { Injectable } from '@nestjs/common';

import { AbstractRepository, DatabaseService } from '@app/common';

import { Reservation } from './entities';

@Injectable()
export class ReservationsRepository extends AbstractRepository<Reservation> {
  constructor(db: DatabaseService) {
    super(db);
  }

  protected get model() {
    return this.db?.reservation;
  }

  protected get repositoryName() {
    return 'Reservation';
  }
}
