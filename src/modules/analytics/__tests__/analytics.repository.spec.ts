import { withDatabase } from '@/database/__utils__.js';
import { createFakeUrl } from '@/modules/url/__tests__/__utils__.js';
import { UrlRepository } from '@/modules/url/url.repository.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsRepository } from '../analytics.repository.js';

describe('AnalyticsRepository', () => {
  let repository: AnalyticsRepository;
  let urlRepository: UrlRepository;

  const { getDb } = withDatabase();
  beforeEach(async () => {
    const db = getDb();
    repository = new AnalyticsRepository(db);
    urlRepository = new UrlRepository(db);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('saveAnalytic', () => {
    it('saves a new analytic record', async () => {
      const fakeAnalytic = {
        shortCode: 'test-short-code',
        ipAddress: '192.168.1.1',
      };

      await repository.saveAnalytic([fakeAnalytic]);

      const storedAnalytic = await repository.getAnalyticsByShortCode(
        fakeAnalytic.shortCode,
      );

      expect(storedAnalytic).toBeDefined();
    });
  });

  describe('getAnalyticsByShortCode', () => {
    it('should return null if no analytic exists for the given short code', async () => {
      const fakeAnalytic = {
        shortCode: 'non-existent-short-code',
        ipAddress: '192.168.1.1',
      };

      const storedAnalytic = await repository.getAnalyticsByShortCode(
        fakeAnalytic.shortCode,
      );

      expect(storedAnalytic).toBeNull();
    });

    it('should return the analytic report for the given short code', async () => {
      vi.setSystemTime(new Date('2026-12-17'));
      const fakeAnalytic = {
        shortCode: 'test123',
        ipAddress: '192.168.1.1',
        createdAt: new Date(),
      };

      const fakeUrl = createFakeUrl();
      await urlRepository.createUrl(fakeUrl);
      await repository.saveAnalytic([fakeAnalytic]);

      const storedAnalytic = await repository.getAnalyticsByShortCode(
        fakeAnalytic.shortCode,
      );

      expect(storedAnalytic).toEqual({
        shortCode: 'test123',
        originalUrl: 'http://example.com/',
        urlCreatedAt: new Date(),
        totalAccesses: 1,
        accessLogs: [{ ipAddress: '192.168.1.1', createdAt: new Date() }],
      });
    });
  });
});
