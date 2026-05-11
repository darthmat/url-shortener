import { FastifyInstance } from 'fastify';
import { IAnalyticsService } from './analytics.interface.js';

export class AnalyticsRouter {
  constructor(private readonly analyticsService: IAnalyticsService) {}
  register(fastify: FastifyInstance) {
    fastify.get('/urls/:shortCode/stats', async (req) => {
      const { shortCode } = req.params as { shortCode: string };

      return await this.analyticsService.getAnalyticsByShortCode(shortCode);
    });
  }
}
