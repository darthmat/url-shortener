import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Url } from '../url.model.js';

describe('Url', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('create', () => {
    it('creates url with generated id', () => {
      const url = Url.create({
        originalUrl: 'http://example.com',
        expiresAt: null,
      });

      expect(url).toBeDefined();
    });

    it('throws validation error when domain is too short', () => {
      expect(() =>
        Url.create({ originalUrl: 'http://.com', expiresAt: null }),
      ).toThrow('Invalid URL: domain must be at least 2 characters');
    });

    it('throws validation error when TLD is too short', () => {
      expect(() =>
        Url.create({ originalUrl: 'http://example.a', expiresAt: null }),
      ).toThrow('Invalid URL: TLD must be at least 2 characters');
    });

    it('throws validation error when url has no domain', () => {
      expect(() =>
        Url.create({ originalUrl: 'http://example', expiresAt: null }),
      ).toThrow('Invalid URL: must contain a valid domain');
    });

    it('throws validation error when protocol is incorrect', () => {
      expect(() =>
        Url.create({
          originalUrl: 'htt://example.com',
          expiresAt: null,
        }),
      ).toThrow('Original URL must start with http:// or https://');
    });

    it('throws validation error when url expiration date is in the past', () => {
      vi.setSystemTime(new Date('2026-12-17'));
      expect(() =>
        Url.create({
          originalUrl: 'http://example.com',
          expiresAt: new Date('2026-12-16'),
        }),
      ).toThrow('Validation failed: Expiration date must be in the future');
    });
  });

  describe('fromData', () => {
    it('creates url from data', () => {
      const url = Url.fromData({
        originalUrl: new URL('http://example.com'),
        shortCode: 'short',
        createdAt: new Date(),
        expiresAt: null,
      });

      expect(url).toBeDefined();
    });
  });

  describe('isExpired', () => {
    it('returns false when url has no expiration date', () => {
      const url = Url.create({
        originalUrl: 'http://example.com',
        expiresAt: null,
      });

      expect(url.isExpired()).toBe(false);
    });

    it('returns false when url is not expired', () => {
      vi.setSystemTime(new Date('2026-12-17'));
      const url = Url.create({
        originalUrl: 'http://example.com',
        expiresAt: new Date('2026-12-18'),
      });

      expect(url.isExpired()).toBe(false);
    });

    it('returns true when url is expired', () => {
      vi.setSystemTime(new Date('2026-12-15'));
      const url = Url.create({
        originalUrl: 'http://example.com',
        expiresAt: new Date('2026-12-16'),
      });

      vi.setSystemTime(new Date('2026-12-17'));
      expect(url.isExpired()).toBe(true);
    });
  });
});
