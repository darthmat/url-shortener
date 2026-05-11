import * as z from 'zod';

export const envSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(4000),
  redis: z.object({
    host: z.string().default('localhost'),
    port: z.coerce.number().default(6379),
    password: z.string().optional(),
    db: z.number().default(0),
  }),
});

export const config = envSchema.parse({
  host: process.env.APP_HOST,
  port: process.env.PORT,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
});

export type Config = z.infer<typeof envSchema>;
