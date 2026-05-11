import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DbConfig } from '../dbConfig.js';

export function createKyselyDialect(config: DbConfig): PostgresDialect {
  return new PostgresDialect({
    pool: new Pool({
      host: config.host,
      database: config.database,
      user: config.user,
      password: config.password,
      port: config.port,
      max: 10,
    }),
  });
}
