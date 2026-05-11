/* eslint-disable @typescript-eslint/naming-convention */
import { Kysely, Generated } from 'kysely';

export type Database = Kysely<UrlShortenerDatabaseTables>;

export interface UrlShortenerDatabaseTables {
  url: UrlTable;
  analytics: AnalyticsTable;
}

interface UrlTable {
  short_code: string;
  original_url: string;
  created_at: Generated<Date>;
  expires_at: Generated<Date | null>;
}

interface AnalyticsTable {
  id: Generated<number>;
  short_code: string;
  ip_address: string;
  created_at: Generated<Date>;
}
