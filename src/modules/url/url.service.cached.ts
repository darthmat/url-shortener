import { Cache } from '@jeengbe/cache';
import { UrlDTO } from './url.dto.js';
import { IUrlService } from './url.interface.js';

export type CachedUrlServiceTypes = Record<`short-code:${string}`, UrlDTO>;

export class CachedUrlService implements IUrlService {
  constructor(
    private readonly delegate: IUrlService,
    private readonly cache: Cache<CachedUrlServiceTypes>,
  ) {}

  async shortenUrl(originalUrl: string, expiresAt: Date): Promise<UrlDTO> {
    return await this.delegate.shortenUrl(originalUrl, expiresAt);
  }

  async getUrl(shortCode: string): Promise<UrlDTO> {
    return await this.cache.cached(
      `short-code:${shortCode}`,
      () => this.delegate.getUrl(shortCode),
      '1h',
    );
  }
}
