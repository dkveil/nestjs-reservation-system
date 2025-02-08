import { Controller, Get, Post, Body, UseFilters, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, CreateReservationDtoSwagger } from './dto/create-reservation.dto';
import { ZodPipe, ZodFilter } from '@app/common';
import { CreateReservationSchema } from './schema/reservation.schema';
import { ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { FindReservationsDto, FindReservationsDtoSwagger } from './dto/find-reservations.dto';

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

	@Get()
	@ApiOperation({ summary: 'Get all reservations' })
	@ApiResponse({
		status: 200,
		description: 'Returns paginated reservations',
		type: FindReservationsDtoSwagger,
		schema: {
			properties: {
				data: {
					type: 'array',
					items: { $ref: getSchemaPath(CreateReservationDtoSwagger) },
				},
				pagination: {
					type: 'object',
					properties: {
						page: { type: 'number' },
						limit: { type: 'number' },
						total: { type: 'number' },
						pages: { type: 'number' },
					},
				},
			},
		},
	})
	@ApiResponse({
		status: 400,
		description: 'Invalid query parameters',
	})
	findAll(@Query(new ZodPipe(FindReservationsDto)) query: FindReservationsDto) {
		return this.reservationsService.findAll(query);
	}
}
