export interface AnalyticDTO {
  shortCode: string;
  ipAddress: string;
  createdAt: Date;
  urlCreatedAt: Date | null;
  originalUrl: string | null;
}
