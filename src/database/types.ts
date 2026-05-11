/* eslint-disable @typescript-eslint/naming-convention */
import { Kysely, Generated } from 'kysely';

export type Database = Kysely<UrlShortenerDatabaseTables>;

export interface UrlShortenerDatabaseTables {
  url: UrlTable;
}

interface UrlTable {
  id: Generated<number>;
  original_url: string;
  short_code: string;
  created_at: Generated<Date>;
}
