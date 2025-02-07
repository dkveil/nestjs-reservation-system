import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, CreateReservationDtoSwagger } from './dto/create-reservation.dto';
import { ZodPipe, ZodFilter } from '@app/common';
import { CreateReservationSchema } from './schema/reservation.schema';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
@UseFilters(ZodFilter)
export class ReservationsController {
	constructor(private readonly reservationsService: ReservationsService) {}

	@Post()
	@ApiOperation({ summary: 'Create new reservation' })
	@ApiResponse({
		status: 201,
		description: 'Reservation created successfully',
		type: CreateReservationDtoSwagger,
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid input data',
	})
	create(
		@Body(new ZodPipe(CreateReservationSchema))
		createReservationDto: CreateReservationDto
	) {
		return this.reservationsService.create(createReservationDto);
	}
}
