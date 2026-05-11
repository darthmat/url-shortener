import { FastifyBaseLogger } from 'fastify';
import { Config } from './config.js';
import { createDatabase } from './database/db.js';
import { DbConfig } from './dbConfig.js';
import { createRedisClient } from './utils/redis.js';
import { HealthzRouter } from './modules/healthz/healthz.router.js';
import { RedisCacheAdapter } from '@jeengbe/cache/dist/adapters/index.js';

export async function container(
  config: Config,
  dbConfig: DbConfig,
  logger: FastifyBaseLogger,
) {
  const db = createDatabase(dbConfig);
  const redisClient = await createRedisClient(config);
  const cacheClient = new RedisCacheAdapter(redisClient);
  const healthzRouter = new HealthzRouter();

  return { db, redisClient, cacheClient, healthzRouter };
}
