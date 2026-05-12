import { Url } from '../url.model.js';

export function createFakeUrl(overrides: Partial<Url> = {}): Url {
  return Url.fromData({
    originalUrl: overrides.originalUrl ?? new URL('http://example.com'),
    expiresAt: overrides.expiresAt ?? null,
    createdAt: overrides.createdAt ?? new Date(),
    shortCode: overrides.shortCode ?? 'test123',
  });
}
