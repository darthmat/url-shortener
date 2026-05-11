import EventEmitter from 'events';
import { FastifyBaseLogger } from 'fastify';
import {
  IAnalyticsRepository,
  IAnalyticsService,
} from './analytics.interface.js';
import { AnalyticDTO, AnalyticReportDTO } from './analytics.dto.js';
import { URL_ANALYTIC_EVENT } from '../url/url.publisher.js';
import { EntityNotFoundError } from '@/utils/errors.js';

export class AnalyticsServiceImpl implements IAnalyticsService {
  private readonly onGetAnalytic: (
    shortCode: string,
    ipAddress: string,
  ) => void;
  private readonly batch: AnalyticDTO[] = [];
  private readonly batchSize = 100;
  constructor(
    private readonly analyticsRepository: IAnalyticsRepository,
    private readonly eventEmitter: EventEmitter,
    private readonly logger: FastifyBaseLogger,
  ) {
    this.onGetAnalytic = (shortCode: string, ipAddress: string) => {
      this.batch.push({ shortCode, ipAddress });

      if (this.batch.length >= this.batchSize) {
        void this.saveAnalytic(this.batch.splice(0));
      }
    };
  }

  registerListeners(): void {
    this.eventEmitter.on(URL_ANALYTIC_EVENT, this.onGetAnalytic);
  }

  private async saveAnalytic(batch: AnalyticDTO[]): Promise<void> {
    await this.analyticsRepository
      .saveAnalytic(batch)
      .catch((error: unknown) => {
        this.logger.error(
          error,
          `[AnalyticsService] Can't save analytic batch of ${batch.length}`,
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
