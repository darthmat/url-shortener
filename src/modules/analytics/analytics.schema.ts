import z from 'zod';

const accessLogSchema = z.object({
  ipAddress: z.ipv4(),
  createdAt: z.coerce.date(),
});

export const analyticReportDTOSchema = z.object({
  shortCode: z.string(),
  originalUrl: z.url(),
  urlCreatedAt: z.coerce.date(),
  totalAccesses: z.number().int().min(0),
  accessLogs: z.array(accessLogSchema),
});

export const analyticDTOSchema = z.object({
  shortCode: z.string(),
  ipAddress: z.ipv4(),
  createdAt: z.coerce.date().optional(),
});

export const urlParamsSchema = z.object({
  shortCode: z.string().min(3).max(100),
});

export const errorSchema = z.object({
  message: z.string(),
});
