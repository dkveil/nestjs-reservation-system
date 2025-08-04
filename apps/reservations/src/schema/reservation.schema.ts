import { z } from 'zod';

import { RESERVATION_CONSTANTS } from './constants';

const ReservationSchemaObject = {
  placeId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  guestsCount: z.number().min(RESERVATION_CONSTANTS.MIN_GUESTS).max(RESERVATION_CONSTANTS.MAX_GUESTS),
  totalPrice: z.number().min(0),
  currency: z.enum(RESERVATION_CONSTANTS.CURRENCIES).default(RESERVATION_CONSTANTS.DEFAULT_CURRENCY),
  notes: z.string().optional(),
};

type ReservationSchemaType = {
  startDate: string;
  endDate: string;
  [key: string]: any;
};

export const CreateReservationSchema = z
  .object(ReservationSchemaObject)
  .refine((data: ReservationSchemaType) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
  });

export const UpdateReservationSchema = z.object({
  status: z.enum(RESERVATION_CONSTANTS.STATUSES),
  notes: z.string().optional(),
}).partial();
