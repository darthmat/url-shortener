/* eslint-disable @typescript-eslint/naming-convention -- Kysely expect snake case for database*/
import { Database } from '@/database/types.js';
import { IAnalyticsRepository } from './analytics.interface.js';
import { AnalyticDTO } from './analytics.dto.js';

export class AnalyticsRepository implements IAnalyticsRepository {
  constructor(private readonly db: Database) {}
  async getAnalyticsByShortCode(shortCode: string): Promise<AnalyticDTO[]> {
    const result = await this.db
      .selectFrom('analytics')
      .leftJoin('url', 'analytics.short_code', 'url.short_code')
      .select([
        'analytics.short_code as shortCode',
        'analytics.ip_address as ipAddress',
        'analytics.created_at as createdAt',
        'url.created_at as urlCreatedAt',
        'url.original_url as originalUrl',
      ])
      .where('analytics.short_code', '=', shortCode)
      .execute();

    return result;
  }

  async saveAnalytic(
    batch: Pick<AnalyticDTO, 'shortCode' | 'ipAddress'>[],
  ): Promise<void> {
    await this.db
      .insertInto('analytics')
      .values(
        batch.map((b) => ({
          short_code: b.shortCode,
          ip_address: b.ipAddress,
        })),
      )
      .execute();
  }
}
