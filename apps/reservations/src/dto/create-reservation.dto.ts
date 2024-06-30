import { Type } from 'class-transformer';
import { IsDate, IsString, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  arrival: Date;

  @IsDate()
  @Type(() => Date)
  departure: Date;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}
