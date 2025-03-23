import { z } from 'zod';

import { UpdateReservationSchema } from '../schema/reservation.schema';

export type UpdateReservationDto = z.infer<typeof UpdateReservationSchema>;
