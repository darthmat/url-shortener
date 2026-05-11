import { UrlDTO } from './url.dto.js';
import { Url } from './url.model.js';

export interface IUrlRepository {
  createUrl(url: Url): Promise<void>;
  getUrlByShortCode(shortCode: string): Promise<Url | null>;
}

export interface IUrlService {
  shortenUrl(originalUrl: string, expiresAt?: Date | null): Promise<UrlDTO>;
  getOriginalUrl(shortCode: string): Promise<UrlDTO | null>;
}

export interface IUrlEventPublisher {
  urlAnalytic(shortUrl: string, ip: string): Promise<void>;
}
