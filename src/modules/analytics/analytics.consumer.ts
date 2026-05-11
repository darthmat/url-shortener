import EventEmitter from 'events';
import { URL_ANALYTIC_EVENT } from '../url/url.publisher.js';
import { AnalyticDTO } from './analytics.dto.js';
import {
  IAnalyticsConsumer,
  IAnalyticsService,
} from './analytics.interface.js';

export class AnalyticsConsumer implements IAnalyticsConsumer {
  private readonly onGetAnalytic: (
    shortCode: string,
    ipAddress: string,
  ) => void;
  private readonly batch: AnalyticDTO[] = [];

  constructor(
    private readonly analyticsService: IAnalyticsService,
    private readonly eventEmitter: EventEmitter,
    private readonly batchSize = 100,
  ) {
    this.onGetAnalytic = (shortCode: string, ipAddress: string) => {
      this.batch.push({ shortCode, ipAddress });

      if (this.batch.length >= this.batchSize) {
        void this.analyticsService.saveAnalytic(this.batch.splice(0));
      }
    };
  }

  registerListeners(): void {
    this.eventEmitter.on(URL_ANALYTIC_EVENT, this.onGetAnalytic);
  }
}
