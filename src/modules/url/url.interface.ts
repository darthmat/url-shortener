import { UrlDto } from './url.dto.js';
import { Url } from './url.model.js';

export interface IUrlRepository {
  createUrl(url: Url): Promise<void>;
  getUrlByShortCode(shortCode: string): Promise<Url | null>;
}

export interface IUrlService {
  shortenUrl(originalUrl: string, expiresAt: Date): Promise<void>;
  getOriginalUrl(shortCode: string): Promise<UrlDto | null>;
}

export interface IUrlEventPublisher {
  urlAnalytic(shortUrl: string, ip: string): Promise<void>;
}
