import { ReservationStatus } from '@prisma/client';
import { z } from 'zod';

import { UpdateReservationSchema } from '../schema/reservation.schema';

export const UpdateReservationMessageSchema = z.object({
  reservationId: z.string(),
  status: z.nativeEnum(ReservationStatus),
  email: z.string(),
  serviceToken: z.string(),
});

export type UpdateReservationDto = z.infer<typeof UpdateReservationSchema>;
export type UpdateReservationMessageDto = z.infer<typeof UpdateReservationMessageSchema>;
