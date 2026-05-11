import { IUrlRepository, IUrlService } from './url.interface.js';
import { Url } from './url.model.js';
import { UrlDto } from './url.dto.js';

export class UrlService implements IUrlService {
  constructor(private readonly urlRepository: IUrlRepository) {}

  async shortenUrl(originalUrl: string, expiresAt: Date): Promise<void> {
    await this.urlRepository.createUrl(Url.create({ originalUrl, expiresAt }));
  }

  async getOriginalUrl(shortCode: string): Promise<UrlDto | null> {
    const url = await this.urlRepository.getUrlByShortCode(shortCode);

    if (!url) return null;

    return {
      originalUrl: url.originalUrl,
      expiresAt: url.expiresAt,
      shortCode: url.shortCode,
      createdAt: url.createdAt,
    };
  }
}
