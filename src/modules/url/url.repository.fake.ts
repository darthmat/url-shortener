import { IUrlRepository } from './url.interface.js';
import { Url } from './url.model.js';

export class UrlRepositoryFake implements IUrlRepository {
  private readonly urls = new Map<string, Url>();

  async createUrl(url: Url): Promise<void> {
    this.urls.set(url.shortCode, url);
  }

  async getUrlByShortCode(shortCode: string): Promise<Url | null> {
    const url = this.urls.get(shortCode);

    return url ?? null;
  }
}
