import { FastifyBaseLogger } from 'fastify';
import {
  IAnalyticsRepository,
  IAnalyticsService,
} from './analytics.interface.js';
import { AnalyticDTO, AnalyticReportDTO } from './analytics.dto.js';
import { EntityNotFoundError } from '@/utils/errors.js';

export class AnalyticsServiceImpl implements IAnalyticsService {
  constructor(
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly logger: FastifyBaseLogger,
  ) {}

  async saveAnalytic(batch: AnalyticDTO[]): Promise<void> {
    await this.analyticsRepository
      .saveAnalytic(batch)
      .catch((error: unknown) => {
        this.logger.error(
          error,
          `[AnalyticsConsumer] Can't save analytic batch of ${batch.length}`,
        );
      });
  }

  async getAnalyticsByShortCode(shortCode: string): Promise<AnalyticReportDTO> {
    const report =
      await this.analyticsRepository.getAnalyticsByShortCode(shortCode);

    if (!report) {
      throw new EntityNotFoundError(
        `Analytics for code ${shortCode} not found`,
      );
    }

    return report;
  }
}
