import { loggerMock } from '@/utils/mock.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IAnalyticsService } from '../analytics.interface.js';
import { AnalyticsRepositoryFake } from '../analytics.repository.fake.js';
import { AnalyticsServiceImpl } from '../analytics.service.js';

describe('AnalyticsService', () => {
  let analyticsService: IAnalyticsService;
  let analyticsRepository: AnalyticsRepositoryFake;

  beforeEach(() => {
    analyticsRepository = new AnalyticsRepositoryFake();
    analyticsService = new AnalyticsServiceImpl(
      analyticsRepository,
      loggerMock,
    );

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getAnalyticsByShortCode', () => {
    it('should throw an error when analytics do not exist', async () => {
      await expect(
        analyticsService.getAnalyticsByShortCode('non-existent-short-code'),
      ).rejects.toThrow('Analytics for code non-existent-short-code not found');
    });

    it('should return an AnalyticsReportDTO when analytics exist', async () => {
      await analyticsRepository.saveAnalytic([
        {
          shortCode: 'test-short-code',
          createdAt: new Date(),
          ipAddress: '192.168.1.1',
        },
      ]);

      const result =
        await analyticsService.getAnalyticsByShortCode('test-short-code');

      expect(result).toEqual({
        shortCode: 'test-short-code',
        originalUrl: 'https://example.com',
        urlCreatedAt: new Date(),
        totalAccesses: 1,
        accessLogs: [{ ipAddress: '192.168.1.1', createdAt: new Date() }],
      });
    });

    it('should increase totalAccess', async () => {
      await analyticsRepository.saveAnalytic([
        {
          shortCode: 'test-short-code',
          createdAt: new Date(),
          ipAddress: '192.168.1.1',
        },
      ]);

      await analyticsRepository.saveAnalytic([
        {
          shortCode: 'test-short-code',
          createdAt: new Date(),
          ipAddress: '192.168.1.2',
        },
      ]);

      const result =
        await analyticsService.getAnalyticsByShortCode('test-short-code');

      expect(result.totalAccesses).toBe(2);
    });
  });

  describe('saveAnalytic', () => {
    it('should save analytics without errors', async () => {
      const batch = [
        {
          shortCode: 'test-short-code',
          createdAt: new Date(),
          ipAddress: '192.168.1.1',
        },
      ];

      await analyticsService.saveAnalytic(batch);

      const report =
        await analyticsService.getAnalyticsByShortCode('test-short-code');

      expect(report).toEqual({
        shortCode: 'test-short-code',
        originalUrl: 'https://example.com',
        urlCreatedAt: new Date(),
        totalAccesses: 1,
        accessLogs: [{ ipAddress: '192.168.1.1', createdAt: new Date() }],
      });
    });

    it('should log an error when saving analytics fails', async () => {
      analyticsRepository.saveAnalytic.mockRejectedValue(new Error('DB Fail'));

      const batch = [
        {
          shortCode: 'test-short-code',
          createdAt: new Date(),
          ipAddress: '192.168.1.1',
        },
      ];

      await expect(
        analyticsService.saveAnalytic(batch),
      ).resolves.toBeUndefined();

      expect(loggerMock.error).toHaveBeenCalledWith(
        new Error('DB Fail'),
        "[AnalyticsConsumer] Can't save analytic batch of 1",
      );
    });
  });
});
