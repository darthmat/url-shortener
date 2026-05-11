import { FastifyInstance } from 'fastify';
import { IAnalyticsService } from './analytics.interface.js';
import { AnalyticReportDTO } from './analytics.dto.js';
import { rateLimitSchema } from '../url/url.schema.js';
import {
  analyticReportDTOSchema,
  errorSchema,
  urlParamsSchema,
} from './analytics.schema.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export class AnalyticsRouter {
  constructor(private readonly analyticsService: IAnalyticsService) {}
  register(fastify: FastifyInstance) {
    const server = fastify.withTypeProvider<ZodTypeProvider>();

    server.get(
      '/urls/:shortCode/stats',
      {
        schema: {
          tags: ['Analytics'],
          params: urlParamsSchema,
          response: {
            200: analyticReportDTOSchema,
            404: errorSchema,
            429: rateLimitSchema,
          },
        },
      },
      async (req): Promise<AnalyticReportDTO> => {
        const { shortCode } = req.params;

        return await this.analyticsService.getAnalyticsByShortCode(shortCode);
      },
    );
  }
}
