import { Kysely } from 'kysely';
import { createKyselyDialect } from './dialect.js';
import { UrlShortenerDatabaseTables } from './types.js';

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export function createDatabase(
  config: DatabaseConfig,
): Kysely<UrlShortenerDatabaseTables> {
  return new Kysely<UrlShortenerDatabaseTables>({
    dialect: createKyselyDialect(config),
    log: ['error'],
  });
}
