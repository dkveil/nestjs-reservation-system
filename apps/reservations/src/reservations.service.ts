import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto';
import { ReservationsRepository } from './reservations.repository';
import { DatabaseService } from '@app/common';
import { Reservation, ReservationCreateInput } from './entities';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReservationsService {
	constructor(private readonly reservationsRepository: ReservationsRepository) {}

	async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
		try {
			return await this.reservationsRepository.transaction(async (db: DatabaseService) => {
				const { userId, placeId, startDate, endDate, guestsCount, totalPrice, currency, notes } = createReservationDto;

				const overlapping = await db.reservation.findFirst({
					where: {
						placeId: placeId,
						startDate: { lte: endDate },
						endDate: { gte: startDate },
					},
				});

				if (overlapping) {
					throw new Error('This time slot is already booked');
				}

				const reservationData: ReservationCreateInput = {
					userId,
					placeId,
					startDate,
					endDate,
					guestsCount,
					totalPrice,
					currency,
					notes,
				};

				return await db.reservation.create({
					data: reservationData,
				});
			});
		} catch (error) {
			throw error;
		}
	}
}
