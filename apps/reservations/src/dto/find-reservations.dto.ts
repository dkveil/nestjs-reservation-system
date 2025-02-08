import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../entities';
import { z } from 'zod';

export const FindReservationsDto = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).optional(),
	order: z.enum(['asc', 'desc']).default('desc'),
	orderBy: z.enum(['createdAt', 'updatedAt', 'totalPrice']).default('createdAt'),
	status: z.enum(Object.values(ReservationStatus) as [string, ...string[]]).optional(),
	startDate: z.string().datetime().optional(),
	endDate: z.string().datetime().optional(),
	placeId: z.string().optional(),
	userId: z.string().optional(),
});

export type FindReservationsDto = z.infer<typeof FindReservationsDto>;

export class FindReservationsDtoSwagger {
	@ApiProperty({
		description: 'Page number',
		minimum: 1,
		default: 1,
	})
	page: number;

	@ApiProperty({
		description: 'Number of items per page',
		minimum: 1,
		maximum: 100,
		default: 10,
	})
	limit: number;

	@ApiProperty({
		description: 'Field to order by',
		enum: ['createdAt', 'startDate', 'endDate', 'totalPrice'],
		default: 'createdAt',
	})
	orderBy: string;

	@ApiProperty({
		description: 'Order direction',
		enum: ['asc', 'desc'],
		default: 'desc',
	})
	order: 'asc' | 'desc';

	@ApiProperty({
		description: 'Reservation status',
		enum: ['PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED', 'REJECTED'],
		required: false,
	})
	status?: string;

	@ApiProperty({
		description: 'Start date filter',
		format: 'date-time',
		required: false,
	})
	startDate?: string;

	@ApiProperty({
		description: 'End date filter',
		format: 'date-time',
		required: false,
	})
	endDate?: string;

	@ApiProperty({
		description: 'User ID filter',
		format: 'uuid',
		required: false,
	})
	userId?: string;

	@ApiProperty({
		description: 'Place ID filter',
		format: 'uuid',
		required: false,
	})
	placeId?: string;
}
