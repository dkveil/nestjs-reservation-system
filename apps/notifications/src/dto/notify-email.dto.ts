import { z } from 'zod';

export const NotifyEmailDto = z.object({
  email: z.string().email(),
  text: z.string(),
});

export type NotifyEmailDto = z.infer<typeof NotifyEmailDto>;
