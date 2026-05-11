import z from 'zod';

export const urlParamsSchema = z.object({
  shortCode: z.string().min(3).max(100),
});

export const urlBodySchema = z.object({
  originalUrl: z.url(),
  expiresAt: z.coerce.date().optional().nullable(),
});

export const urlDTOSchema = z.object({
  shortCode: z.string().min(3).max(100),
  originalUrl: z.url(),
  expiresAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date(),
});

export const rateLimitSchema = z.object({
  error: z.string(),
  message: z.string(),
});

export const errorSchema = z.object({
  message: z.string(),
});
