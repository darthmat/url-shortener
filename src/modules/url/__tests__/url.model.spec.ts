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

    it('throws validation error when originalUrl is too short', () => {
      expect(() =>
        Url.create({ originalUrl: 'http://e.com', expiresAt: null }),
      ).toThrow('Original URL must be at least 6 characters long');
    });

    it('throws validation error when originalUrl is too long', () => {
      expect(() =>
        Url.create({
          originalUrl: 'http://' + 'a'.repeat(101),
          expiresAt: null,
        }),
      ).toThrow('Original URL must be at most 100 characters long');
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
});
