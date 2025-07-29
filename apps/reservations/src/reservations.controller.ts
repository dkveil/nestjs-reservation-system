import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { CurrentUser, JwtAuthGuard, User, ZodFilter, ZodPipe } from '@app/common';

import { CreateReservationDto, CreateReservationDtoSwagger } from './dto/create-reservation.dto';
import { FindReservationsDto, FindReservationsDtoSwagger } from './dto/find-reservations.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsService } from './reservations.service';
import { CreateReservationSchema, UpdateReservationSchema } from './schema/reservation.schema';

@ApiTags('Reservations')
@Controller('reservations')
@UseFilters(ZodFilter)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard)
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
  async create(
    @Body(new ZodPipe(CreateReservationSchema))
    createReservationDto: CreateReservationDto,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;

    return this.reservationsService.create(createReservationDto, userId);
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
  async findAll(@Query(new ZodPipe(FindReservationsDto)) query: FindReservationsDto) {
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
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reservation' })
  @ApiParam({
    name: 'id',
    description: 'Reservation ID',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation updated successfully',
    type: CreateReservationDtoSwagger,
  })
  async update(@Param('id') id: string, @Body(new ZodPipe(UpdateReservationSchema)) updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel reservation' })
  @ApiParam({
    name: 'id',
    description: 'Reservation ID',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Reservation canceled successfully',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async cancel(@Param('id') id: string) {
    return this.reservationsService.cancel(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reservation' })
  @ApiParam({
    name: 'id',
    description: 'Reservation ID',
    type: 'string',
    format: 'uuid',
    required: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Reservation deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.reservationsService.remove(id);
  }
}
