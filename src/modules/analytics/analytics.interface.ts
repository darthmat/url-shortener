import { AnalyticDTO } from './analytics.dto.js';

export interface IAnalyticsRepository {
  saveAnalytic(
    batch: { shortCode: string; ipAddress: string }[],
  ): Promise<void>;
  getAnalyticsByShortCode(shortCode: string): Promise<AnalyticDTO[]>;
}

export interface IAnalyticsService {
  getAnalyticsByShortCode(shortCode: string): Promise<AnalyticDTO[]>;
}
