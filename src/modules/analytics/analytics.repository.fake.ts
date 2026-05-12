import { vi } from 'vitest';
import { AnalyticDTO, AnalyticReportDTO } from './analytics.dto.js';
import { IAnalyticsRepository } from './analytics.interface.js';

export class AnalyticsRepositoryFake implements IAnalyticsRepository {
  private readonly analytics = new Map<string, AnalyticReportDTO>();

  saveAnalytic = vi.fn<IAnalyticsRepository['saveAnalytic']>(
    async (batch: AnalyticDTO[]): Promise<void> => {
      for (const analytic of batch) {
        this.analytics.set(analytic.shortCode, {
          shortCode: analytic.shortCode,
          originalUrl: 'https://example.com',
          urlCreatedAt: new Date(),
          totalAccesses: 1,
          accessLogs: [
            {
              ipAddress: analytic.ipAddress,
              createdAt: new Date(),
            },
          ],
        });
      }
    },
  );

  async getAnalyticsByShortCode(
    shortCode: string,
  ): Promise<AnalyticReportDTO | null> {
    const url = this.analytics.get(shortCode);

    return url ?? null;
  }
}
