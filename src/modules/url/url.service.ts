import { UrlDTO } from './url.dto.js';
import { IUrlRepository, IUrlService } from './url.interface.js';
import { Url } from './url.model.js';

export class UrlService implements IUrlService {
  constructor(private readonly urlRepository: IUrlRepository) {}

  async shortenUrl(
    originalUrl: string,
    expiresAt?: Date | null,
  ): Promise<UrlDTO> {
    const url = Url.create({ originalUrl, expiresAt });

    await this.urlRepository.createUrl(url);

    return {
      originalUrl: url.originalUrl.toString(),
      expiresAt: url.expiresAt,
      shortCode: url.shortCode,
      createdAt: url.createdAt,
    };
  }

  async getOriginalUrl(shortCode: string): Promise<UrlDTO | null> {
    const url = await this.urlRepository.getUrlByShortCode(shortCode);

    if (!url) return null;

    return {
      originalUrl: url.originalUrl.toString(),
      expiresAt: url.expiresAt,
      shortCode: url.shortCode,
      createdAt: url.createdAt,
    };
  }
}
