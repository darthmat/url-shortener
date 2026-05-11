import { z } from 'zod';
import {
  analyticReportDTOSchema,
  analyticDTOSchema,
} from './analytics.schema.js';

export type AnalyticReportDTO = z.infer<typeof analyticReportDTOSchema>;
export type AnalyticDTO = z.infer<typeof analyticDTOSchema>;
