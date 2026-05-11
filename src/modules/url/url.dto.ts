import z from 'zod';
import { urlDTOSchema } from './url.schema.js';

export type UrlDTO = z.infer<typeof urlDTOSchema>;
