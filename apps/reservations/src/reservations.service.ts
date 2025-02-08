import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto';
import { ReservationsRepository } from './reservations.repository';
import { DatabaseService, RedisService, Pagination, FilterQuery, FindManyOptions } from '@app/common';
import { Reservation, ReservationCreateInput } from './entities';
import { FindReservationsDto } from './dto/find-reservations.dto';

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

			const cachedKey = `reservation:${reservation.id}`;
			await this.redisService.set(cachedKey, JSON.stringify(reservation), 900);

			return reservation;
		} catch (error) {
			throw error;
		}
	}

	async findAll(query: FindReservationsDto): Promise<{ data: Reservation[]; pagination: Pagination }> {
		const { page, limit, order, orderBy, status, startDate, endDate, placeId, userId } = query;

		const where: FilterQuery<FindReservationsDto> = {};

		if (status) where.status = status;
		if (userId) where.userId = userId;
		if (placeId) where.placeId = placeId;
		if (startDate) where.startDate = { gte: startDate };
		if (endDate) where.endDate = { lte: endDate };

		try {
			const [data, total] = await Promise.all([
				this.reservationsRepository.findMany({
					filterQuery: where,
					orderBy: {
						[orderBy]: order,
					},
					pagination: {
						take: limit,
						skip: limit ? (page - 1) * limit : undefined,
					},
				}),
				this.reservationsRepository.count(where),
			]);

			const pagination = {
				page,
				limit,
				pages: limit ? Math.ceil(total / limit) : 1,
				total,
			};

			const result = { data, pagination };

			const cachedKey = `reservations:${JSON.stringify(query)}`;
			await this.redisService.set(cachedKey, JSON.stringify(result), 900);

			return result;
		} catch (error) {
			throw error;
		}
	}
}
