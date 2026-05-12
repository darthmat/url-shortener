import { withDatabase } from '@/database/__utils__.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { UrlRepository } from '../url.repository.js';
import { createFakeUrl } from './__utils__.js';

describe('UrlRepository', () => {
  let repository: UrlRepository;

  const { getDb } = withDatabase();
  beforeEach(async () => {
    const db = getDb();
    repository = new UrlRepository(db);
  });

  describe('createUrl', () => {
    it('creates a new url record', async () => {
      const fakeUrl = createFakeUrl();

      await repository.createUrl(fakeUrl);

      const storedUrl = await repository.getUrlByShortCode(fakeUrl.shortCode);

      expect(storedUrl).toBeDefined();
    });
  });

  describe('getUrlByShortCode', () => {
    it('should return null if no url exists for the given short code', async () => {
      const fakeUrl = createFakeUrl();

      const storedUrl = await repository.getUrlByShortCode(fakeUrl.shortCode);

      expect(storedUrl).toBeNull();
    });
  });
});
