import { Body, Controller, Get, Param, Post, Query, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { ZodFilter, ZodPipe } from '@app/common';

import { CreateReservationDto, CreateReservationDtoSwagger } from './dto/create-reservation.dto';
import { FindReservationsDto, FindReservationsDtoSwagger } from './dto/find-reservations.dto';
import { ReservationsService } from './reservations.service';
import { CreateReservationSchema } from './schema/reservation.schema';

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
    createReservationDto: CreateReservationDto,
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
    return this.reservationsService.findOne(id);
  }
}
