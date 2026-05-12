/* eslint-disable @typescript-eslint/naming-convention -- Kysely expect snake case for database*/
import { Database } from '@/database/types.js';
import { IAnalyticsRepository } from './analytics.interface.js';
import { AnalyticDTO, AnalyticReportDTO } from './analytics.dto.js';

export class AnalyticsRepository implements IAnalyticsRepository {
  constructor(private readonly db: Database) {}
  async getAnalyticsByShortCode(
    shortCode: string,
  ): Promise<AnalyticReportDTO | null> {
    const urlInfo = await this.db
      .selectFrom('url')
      .select(['original_url as originalUrl', 'created_at as urlCreatedAt'])
      .where('short_code', '=', shortCode)
      .executeTakeFirst();

    if (!urlInfo) return null;

    const logs = await this.db
      .selectFrom('analytics')
      .select(['ip_address as ipAddress', 'created_at as createdAt'])
      .where('short_code', '=', shortCode)
      .orderBy('created_at', 'desc')
      .execute();

    return {
      shortCode,
      originalUrl: urlInfo.originalUrl,
      urlCreatedAt: urlInfo.urlCreatedAt,
      totalAccesses: logs.length,
      accessLogs: logs,
    };
  }

  async saveAnalytic(batch: AnalyticDTO[]): Promise<void> {
    await this.db
      .insertInto('analytics')
      .values(
        batch.map((b) => ({
          short_code: b.shortCode,
          ip_address: b.ipAddress,
          created_at: b.createdAt,
        })),
      )
      .execute();
  }
}
