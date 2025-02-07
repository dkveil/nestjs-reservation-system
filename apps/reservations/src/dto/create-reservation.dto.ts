import { z } from 'zod';
import { CreateReservationSchema } from '../schema/reservation.schema';

export type CreateReservationDto = z.infer<typeof CreateReservationSchema>;
