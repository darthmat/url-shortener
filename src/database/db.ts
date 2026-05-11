import { Kysely } from 'kysely';
import { DbConfig } from '../dbConfig.js';
import { createKyselyDialect } from './dialect.js';
import { UrlShortenerDatabaseTables } from './types.js';

export function createDatabase(
  dbConfig: DbConfig,
): Kysely<UrlShortenerDatabaseTables> {
  return new Kysely<UrlShortenerDatabaseTables>({
    dialect: createKyselyDialect(dbConfig),
    log: ['error'],
  });
}
