import { FastifyBaseLogger } from 'fastify';
import { vi } from 'vitest';

export const loggerMock = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  fatal: vi.fn(),
  trace: vi.fn(),
  child: vi.fn().mockReturnThis(),
} as unknown as FastifyBaseLogger;
