import { EntityNotFoundError, ExpiredError } from '@/utils/errors.js';
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

    return toUrlDTO(url);
  }

  async getUrl(shortCode: string): Promise<UrlDTO> {
    const url = await this.urlRepository.getUrlByShortCode(shortCode);

    if (!url) {
      throw new EntityNotFoundError('URL not found');
    }

    if (url.isExpired()) {
      throw new ExpiredError('URL has expired');
    }

    return toUrlDTO(url);
  }
}

function toUrlDTO(url: Url): UrlDTO {
  return {
    originalUrl: url.originalUrl.toString(),
    expiresAt: url.expiresAt,
    shortCode: url.shortCode,
    createdAt: url.createdAt,
  };
}
