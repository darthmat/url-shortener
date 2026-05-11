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
  database: z.object({
    host: z.string(),
    port: z.coerce.number(),
    user: z.string(),
    password: z.string(),
    database: z.string(),
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
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

export type Config = z.infer<typeof envSchema>;
