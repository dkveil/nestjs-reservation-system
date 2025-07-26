import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3157),
  DATABASE_URL: z.string(),
  USE_REDIS: z.string().default('false'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().default(''),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.coerce.number().default(3600),
  CORS_ORIGIN: z.string().default('*'),
});
