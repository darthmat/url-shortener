import { vi } from 'vitest';
import { AnalyticDTO, AnalyticReportDTO } from './analytics.dto.js';
import { IAnalyticsRepository } from './analytics.interface.js';

export class AnalyticsRepositoryFake implements IAnalyticsRepository {
  private readonly logs: AnalyticDTO[] = [];

  saveAnalytic = vi.fn<IAnalyticsRepository['saveAnalytic']>(
    async (batch: AnalyticDTO[]): Promise<void> => {
      for (const analytic of batch) {
        this.logs.push(analytic);
      }
    },
  );

  async getAnalyticsByShortCode(
    shortCode: string,
  ): Promise<AnalyticReportDTO | null> {
    const analyticLogs = this.logs.filter((log) => log.shortCode === shortCode);

    if (analyticLogs.length === 0) {
      return null;
    }

    return {
      shortCode,
      originalUrl: 'https://example.com',
      urlCreatedAt: new Date(),
      totalAccesses: analyticLogs.length,
      accessLogs: analyticLogs.map((log) => ({
        ipAddress: log.ipAddress,
        createdAt: log.createdAt!,
      })),
    };
  }
}
