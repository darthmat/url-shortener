import { FastifyInstance } from 'fastify';
import { IUrlService } from './url.interface.js';
import { EntityNotFoundError, ExpiredError } from '@/utils/errors.js';

export class UrlRouter {
  constructor(private readonly urlService: IUrlService) {}
  register(fastify: FastifyInstance) {
    fastify.get('/urls/:shortCode', async (req, res) => {
      const { shortCode } = req.params as { shortCode: string };
      const url = await this.urlService.getOriginalUrl(shortCode);

      if (!url) {
        throw new EntityNotFoundError('URL not found');
      }

      if (url.expiresAt < new Date()) {
        throw new ExpiredError('URL has expired');
      }

      res.redirect(url.originalUrl.toString(), 302);
    });

    fastify.post('/urls', async (req, res) => {
      const { originalUrl, expiresAt } = req.body as {
        originalUrl: string;
        expiresAt: Date;
      };

      await this.urlService.shortenUrl(originalUrl, expiresAt);
      res.status(201).send();
    });
  }
}
