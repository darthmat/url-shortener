import { AnalyticDTO, AnalyticReportDTO } from './analytics.dto.js';

export interface IAnalyticsRepository {
  saveAnalytic(batch: AnalyticDTO[]): Promise<void>;
  getAnalyticsByShortCode(shortCode: string): Promise<AnalyticReportDTO | null>;
}

export interface IAnalyticsService {
  saveAnalytic(batch: AnalyticDTO[]): Promise<void>;
  getAnalyticsByShortCode(shortCode: string): Promise<AnalyticReportDTO>;
}
