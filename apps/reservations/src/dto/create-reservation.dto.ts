import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { RESERVATION_CONSTANTS } from '../schema/constants';
import { CreateReservationSchema } from '../schema/reservation.schema';

export type CreateReservationDto = z.infer<typeof CreateReservationSchema>;

export class CreateReservationDtoSwagger {
  // @ApiProperty({
  //   description: 'User ID',
  //   format: 'uuid',
  // })
  // userId: string;

  @ApiProperty({
    description: 'Place ID',
    format: 'uuid',
  })
  placeId: string;

  @ApiProperty({
    description: 'Start date of reservation',
    format: 'date-time',
  })
  startDate: string;

  @ApiProperty({
    description: 'End date of reservation',
    format: 'date-time',
  })
  endDate: string;

  @ApiProperty({
    description: 'Number of guests',
    minimum: RESERVATION_CONSTANTS.MIN_GUESTS,
    maximum: RESERVATION_CONSTANTS.MAX_GUESTS,
    default: 1,
  })
  guestsCount: number;

  @ApiProperty({
    description: 'Total price',
    minimum: 0,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Currency',
    enum: RESERVATION_CONSTANTS.CURRENCIES,
    default: RESERVATION_CONSTANTS.DEFAULT_CURRENCY,
  })
  currency: string;

  @ApiProperty({
    description: 'Additional notes',
    required: false,
  })
  notes?: string;
}
