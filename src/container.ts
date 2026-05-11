import { FastifyBaseLogger } from 'fastify';
import { Config } from './config.js';
import { createDatabase } from './database/db.js';
import { createRedisClient } from './utils/redis.js';
import { HealthzRouter } from './modules/healthz/healthz.router.js';
import { RedisCacheAdapter } from '@jeengbe/cache/dist/adapters/index.js';
import { UrlRepository } from './modules/url/url.repository.js';
import { UrlService } from './modules/url/url.service.js';
import { CachedUrlService } from './modules/url/url.service.cached.js';
import { UrlRouter } from './modules/url/url.router.js';
import { Cache } from '@jeengbe/cache/dist/cache.js';
import { UrlEventPublisher } from './modules/url/url.publisher.js';
import EventEmitter from 'events';
import { AnalyticsServiceImpl } from './modules/analytics/analytics.service.js';
import { AnalyticsRepository } from './modules/analytics/analytics.repository.js';
import { AnalyticsRouter } from './modules/analytics/analytics.router.js';

export async function container(config: Config, logger: FastifyBaseLogger) {
  const db = createDatabase(config.database);
  const appEvents = new EventEmitter();
  const redisClient = await createRedisClient(config);
  const cacheClient = new RedisCacheAdapter(redisClient);
  const urlEventPublisher = new UrlEventPublisher(appEvents);

  const healthzRouter = new HealthzRouter();
  const urlRouter = new UrlRouter(
    new CachedUrlService(
      new UrlService(new UrlRepository(db)),
      new Cache(cacheClient),
    ),
    urlEventPublisher,
    logger,
  );

  const analyticsService = new AnalyticsServiceImpl(
    new AnalyticsRepository(db),
    appEvents,
    logger,
  );

  analyticsService.registerListeners();

  const analyticsRouter = new AnalyticsRouter(analyticsService);

  return {
    db,
    redisClient,
    cacheClient,
    healthzRouter,
    urlRouter,
    analyticsRouter,
  };
}
