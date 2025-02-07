import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ZodPipe, ZodFilter } from '@app/common';
import { CreateReservationSchema } from './schema/reservation.schema';

@Controller('reservations')
@UseFilters(ZodFilter)
export class ReservationsController {
	constructor(private readonly reservationsService: ReservationsService) {}

	@Post()
	create(@Body(new ZodPipe(CreateReservationSchema)) createReservationDto: CreateReservationDto) {
		return this.reservationsService.create(createReservationDto);
	}
}
