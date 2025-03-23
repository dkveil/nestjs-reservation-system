import { Controller, Get, Post, Body, UseFilters, Query, Param } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, CreateReservationDtoSwagger } from './dto/create-reservation.dto';
import { ZodPipe, ZodFilter } from '@app/common';
import { CreateReservationSchema } from './schema/reservation.schema';
import { ApiOperation, ApiResponse, ApiTags, getSchemaPath, ApiParam } from '@nestjs/swagger';
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
	@ApiResponse({
		status: 409,
		description: 'This time slot is already booked',
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

	@Get(':id')
	@ApiOperation({ summary: 'Get reservation by ID' })
	@ApiParam({
		name: 'id',
		description: 'Reservation ID',
		type: 'string',
		format: 'uuid',
		required: true,
	})
	@ApiResponse({
		status: 200,
		description: 'Found reservation',
	})
	@ApiResponse({ status: 404, description: 'Reservation not found' })
	findOne(@Param('id') id: string) {
		console.log('findOne', id);
		return this.reservationsService.findOne(id);
	}
}
