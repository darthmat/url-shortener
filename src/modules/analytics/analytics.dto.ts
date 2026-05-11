export interface AnalyticReportDTO {
  shortCode: string;
  originalUrl: string;
  urlCreatedAt: Date;
  totalAccesses: number;
  accessLogs: AccessLog[];
}

interface AccessLog {
  ipAddress: string;
  createdAt: Date;
}

export interface AnalyticDTO {
  shortCode: string;
  ipAddress: string;
}
