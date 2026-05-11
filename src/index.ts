import fastifyRateLimit from '@fastify/rate-limit';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import fastifyGracefulShutdown from 'fastify-graceful-shutdown';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { container } from './container.js';
import { errorHandler } from './utils/errors.js';
import { config } from './config.js';

async function start() {
  const app = fastify({ logger: true });

  try {
    const {
      db,
      redisClient: redis,
      healthzRouter,
      urlRouter,
      analyticsRouter,
    } = await container(config, app.log);

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.setErrorHandler(errorHandler);

    app.register(fastifySwagger, {
      openapi: { info: { title: 'Games API', version: '1.0.0' } },
      transform: jsonSchemaTransform,
    });
    app.register(fastifySwaggerUi, { routePrefix: '/docs' });
    app.register(fastifyGracefulShutdown);
    app.register(fastifyRateLimit, {
      max: 30,
      timeWindow: '1 minute',
      redis,
    });

    app.register(
      (instance, _, done) => {
        healthzRouter.register(instance);
        urlRouter.register(instance);
        analyticsRouter.register(instance);
        done();
      },
      { prefix: '/api' },
    );

    await app.listen({ port: config.port, host: config.host });

    app.gracefulShutdown(async (signal) => {
      app.log.info('Received signal to shutdown: %s', signal);
      try {
        await Promise.all([db.destroy(), redis.quit()]);
      } catch (err) {
        app.log.error(err, 'Error during shutdown');
      }
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

await start();
