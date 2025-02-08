import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto';
import { ReservationsRepository } from './reservations.repository';
import { DatabaseService, RedisService } from '@app/common';
import { Reservation, ReservationCreateInput } from './entities';

@Injectable()
export class ReservationsService {
	constructor(
		private readonly reservationsRepository: ReservationsRepository,
		private readonly redisService: RedisService
	) {}

	async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
		try {
			const reservation = await this.reservationsRepository.transaction(async (db: DatabaseService) => {
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

			await this.redisService.set(`reservation:${reservation.id}`, JSON.stringify(reservation), 3600);

			return reservation;
		} catch (error) {
			throw error;
		}
	}
}
