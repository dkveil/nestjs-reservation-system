import { z } from 'zod';

export const GetUserDto = z.object({
  id: z.string(),
});

export type GetUserDto = z.infer<typeof GetUserDto>;
