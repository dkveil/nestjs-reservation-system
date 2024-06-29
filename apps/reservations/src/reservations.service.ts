import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private reservationsRepository: ReservationsRepository) {}

  create(createReservationDto: CreateReservationDto) {
    const { arrival, departure } = createReservationDto;

    const reservation = {
      name: 'test',
      arrival: new Date(arrival),
      departure: new Date(departure),
      userId: 'test',
      placeId: 'test',
      invoiceId: 'test',
    };

    return this.reservationsRepository.create(reservation);
  }

  findAll() {
    return this.reservationsRepository.findAll();
  }

  findOne(id: string) {
    return this.reservationsRepository.findOne({ id });
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    const { arrival, departure } = updateReservationDto;

    const updateReservation = {
      arrival: new Date(arrival),
      departure: new Date(departure),
    };

    return this.reservationsRepository.update({ id }, updateReservation);
  }

  remove(id: string) {
    return this.reservationsRepository.remove({ id });
  }
}
