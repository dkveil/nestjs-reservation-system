import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3157),
  DATABASE_URL: z.string(),
  USE_REDIS: z.string().default('false'),
  REDIS_HOST: z.string().default('redis'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().default(''),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.coerce.number().default(3600),
  CORS_ORIGIN: z.string().default('*'),
  RESERVATIONS_PORT: z.string().default('3158'),
  AUTH_TCP_HOST: z.string().default('auth'),
  AUTH_TCP_PORT: z.coerce.number().default(3001),
  PAYMENTS_HOST: z.string().default('payments'),
  PAYMENTS_PORT: z.coerce.number().default(3159),
  PAYMENTS_TCP_PORT: z.coerce.number().default(3002),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_SUCCESS_URL: z.string(),
  STRIPE_CANCEL_URL: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
});
