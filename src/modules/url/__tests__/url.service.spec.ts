import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IUrlService } from '../url.interface.js';
import { Url } from '../url.model.js';
import { UrlRepositoryFake } from '../url.repository.fake.js';
import { UrlService } from '../url.service.js';

vi.mock('nanoid', () => ({
  nanoid: () => 'test-short-code',
}));

describe('UrlService', () => {
  let urlService: IUrlService;
  let urlRepository: UrlRepositoryFake;

  beforeEach(() => {
    urlRepository = new UrlRepositoryFake();
    urlService = new UrlService(urlRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getUrl', () => {
    it('should return null when url does not exist', async () => {
      const result = await urlService.getUrl('non-existent-short-code');

      expect(result).toBeNull();
    });

    it('should return an UrlDTO when url exists', async () => {
      const mockUrl = Url.fromData({
        originalUrl: new URL('https://example.com'),
        expiresAt: new Date(),
        shortCode: 'test-short-code',
        createdAt: new Date(),
      });

      await urlRepository.createUrl(mockUrl);

      const result = await urlService.getUrl('test-short-code');

      expect(result).toEqual({
        originalUrl: 'https://example.com/',
        expiresAt: new Date(),
        shortCode: 'test-short-code',
        createdAt: new Date(),
      });
    });
  });

  describe('shortenUrl', () => {
    it('should create a new url and return an UrlDTO', async () => {
      const result = await urlService.shortenUrl('https://example.com');

      expect(result).toEqual({
        originalUrl: 'https://example.com/',
        expiresAt: null,
        shortCode: 'test-short-code',
        createdAt: new Date(),
      });
    });
  });
});
