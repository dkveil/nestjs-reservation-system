import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CardSchema = z.object({
  number: z.string(),
  exp_month: z.number(),
  exp_year: z.number(),
  cvc: z.string(),
});

export type CardDto = z.infer<typeof CardSchema>;

export class CardDtoSwagger {
  @ApiProperty({
    description: 'Card number',
    example: '4242424242424242',
  })
  number: string;

  @ApiProperty({
    description: 'Expiration month',
    minimum: 1,
    maximum: 12,
    example: 12,
  })
  exp_month: number;

  @ApiProperty({
    description: 'Expiration year',
    example: 2025,
  })
  exp_year: number;

  @ApiProperty({
    description: 'CVC code',
    example: '123',
  })
  cvc: string;
}
