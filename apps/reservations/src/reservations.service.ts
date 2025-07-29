import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService, FilterQuery, Pagination, RedisService } from '@app/common';

import { CreateReservationDto, UpdateReservationDto } from './dto';
import { FindReservationsDto } from './dto/find-reservations.dto';
import { Reservation, ReservationCreateInput, ReservationStatus } from './entities';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    private readonly redisService: RedisService,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.transaction(async (db: DatabaseService) => {
      const { placeId, startDate, endDate, guestsCount, totalPrice, currency, notes } = createReservationDto;

      const overlapping = await db.reservation.findFirst({
        where: {
          placeId,
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      });

      if (overlapping) {
        throw new ConflictException('This time slot is already booked');
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
  }

  async findAll(query: FindReservationsDto): Promise<{ data: Reservation[]; pagination: Pagination }> {
    const { page, limit, order, orderBy, status, startDate, endDate, placeId, userId } = query;

    if (this.redisService.isEnabled()) {
      const cachedKey = `reservations:${JSON.stringify(query)}`;
      const cachedData = await this.redisService.get(cachedKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }

    const where: FilterQuery<FindReservationsDto> = {};

    if (status)
      where.status = status;
    if (userId)
      where.userId = userId;
    if (placeId)
      where.placeId = placeId;
    if (startDate)
      where.startDate = { gte: startDate };
    if (endDate)
      where.endDate = { lte: endDate };
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

    if (this.redisService.isEnabled()) {
      const cachedKey = `reservations:${JSON.stringify(query)}`;
      await this.redisService.set(cachedKey, JSON.stringify(result), 900);
    }

    return result;
  }

  async findOne(id: string): Promise<Reservation> {
    if (this.redisService.isEnabled()) {
      const cachedKey = `reservation:${id}`;
      const cachedReservation = await this.redisService.get(cachedKey);

      if (cachedReservation) {
        return JSON.parse(cachedReservation);
      }
    }

    const reservation = await this.reservationsRepository.findOne({ filterQuery: { id } });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (this.redisService.isEnabled()) {
      const cachedKey = `reservation:${id}`;
      await this.redisService.set(cachedKey, JSON.stringify(reservation), 900);
    }

    return reservation;
  }

  async update(id: string, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.reservationsRepository.transaction(async (db: DatabaseService) => {
      const existingReservation = await db.reservation.findUnique({
        where: { id },
      });

      if (!existingReservation) {
        throw new NotFoundException('Reservation not found');
      }

      const { status, notes } = updateReservationDto;

      const updateData: FilterQuery<UpdateReservationDto> = {};

      if (status)
        updateData.status = status;
      if (notes)
        updateData.notes = notes;

      const reservation = await db.reservation.update({
        where: { id },
        data: updateData,
      });

      return reservation;
    });

    if (this.redisService.isEnabled()) {
      const cachedKey = `reservation:${id}`;
      await this.redisService.set(cachedKey, JSON.stringify(reservation), 900);
    }

    return reservation;
  }

  async cancel(id: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.transaction(async (db: DatabaseService) => {
      const existingReservation = await db.reservation.findUnique({
        where: { id },
      });

      if (!existingReservation) {
        throw new NotFoundException('Reservation not found');
      }

      return await db.reservation.update({
        where: { id },
        data: {
          status: ReservationStatus.CANCELED,
          canceledAt: new Date(),
        },
      });
    });

    if (this.redisService.isEnabled()) {
      const cachedKey = `reservation:${id}`;
      await this.redisService.set(cachedKey, JSON.stringify(reservation), 900);
    }

    return reservation;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.reservationsRepository.remove({ id });

    if (this.redisService.isEnabled()) {
      const cachedKey = `reservation:${id}`;
      await this.redisService.del(cachedKey);
    }
  }
}
