/* eslint-disable @typescript-eslint/naming-convention -- Kysely expect snake case for database*/

import { Database } from '@/database/types.js';
import { IUrlRepository } from './url.interface.js';
import { Url } from './url.model.js';

export class UrlRepository implements IUrlRepository {
  constructor(private readonly db: Database) {}
  async createUrl(url: Url): Promise<void> {
    await this.db
      .insertInto('url')
      .values({
        original_url: url.originalUrl.toString(),
        short_code: url.shortCode,
        created_at: url.createdAt,
        expires_at: url.expiresAt,
      })
      .execute();
  }

  async getUrlByShortCode(shortCode: string): Promise<Url | null> {
    const result = await this.db
      .selectFrom('url')
      .selectAll()
      .where('short_code', '=', shortCode)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    return Url.fromData({
      originalUrl: new URL(result.original_url),
      shortCode: result.short_code,
      createdAt: result.created_at,
      expiresAt: result.expires_at,
    });
  }
}
