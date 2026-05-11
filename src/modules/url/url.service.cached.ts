import { Cache } from '@jeengbe/cache';
import { IUrlService } from './url.interface.js';
import { UrlDto } from './url.dto.js';

export type CachedUrlServiceTypes = Record<
  `short-code:${string}`,
  UrlDto | null
>;

export class CachedUrlService implements IUrlService {
  constructor(
    private readonly delegate: IUrlService,
    private readonly cache: Cache<CachedUrlServiceTypes>,
  ) {}

  async shortenUrl(originalUrl: string, expiresAt: Date): Promise<void> {
    await this.delegate.shortenUrl(originalUrl, expiresAt);
  }

  async getOriginalUrl(shortCode: string): Promise<UrlDto | null> {
    return await this.cache.cached(
      `short-code:${shortCode}`,
      () => this.delegate.getOriginalUrl(shortCode),
      '1h',
    );
  }
}
