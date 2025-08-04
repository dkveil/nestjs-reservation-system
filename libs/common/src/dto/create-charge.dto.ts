import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

import { RESERVATION_CONSTANTS } from 'apps/reservations/src/schema/constants';

export const CreateChargeSchema = z.object({
  amount: z.number().min(0),
  currency: z.enum(RESERVATION_CONSTANTS.CURRENCIES),
});

export type CreateChargeDto = z.infer<typeof CreateChargeSchema>;

export class CreateChargeDtoSwagger {
  @ApiProperty({
    description: 'Amount to charge',
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency for the charge',
    enum: RESERVATION_CONSTANTS.CURRENCIES,
  })
  currency: string;
}
