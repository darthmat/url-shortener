import { FastifyInstance } from 'fastify';

export class HealthzRouter {
  register(fastify: FastifyInstance) {
    fastify.get('/healthz', async (_req, res) => {
      const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
      };
      try {
        res.send(healthcheck);
      } catch (error: unknown) {
        res.status(503).send();
      }
    });
  }
}
