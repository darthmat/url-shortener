import { FastifyBaseLogger, FastifyInstance } from 'fastify';
import { IUrlEventPublisher, IUrlService } from './url.interface.js';
import { EntityNotFoundError, ExpiredError } from '@/utils/errors.js';

export class UrlRouter {
  constructor(
    private readonly urlService: IUrlService,
    private readonly urlEventPublisher: IUrlEventPublisher,
    private readonly log: FastifyBaseLogger,
  ) {}
  register(fastify: FastifyInstance) {
    fastify.get('/urls/:shortCode', async (req, res) => {
      const { shortCode } = req.params as { shortCode: string };
      const url = await this.urlService.getOriginalUrl(shortCode);

      this.urlEventPublisher
        .urlAnalytic(shortCode, req.ip)
        .catch((err: unknown) => {
          this.log.error(
            { err, shortCode },
            'Failed to publish analytic event',
          );
        });

      if (!url) {
        throw new EntityNotFoundError('URL not found');
      }

      if (url.expiresAt < new Date()) {
        throw new ExpiredError('URL has expired');
      }

      return await res.redirect(url.originalUrl.toString(), 302);
    });

    fastify.post('/urls', async (req, res) => {
      const { originalUrl, expiresAt } = req.body as {
        originalUrl: string;
        expiresAt: Date;
      };

      await this.urlService.shortenUrl(originalUrl, expiresAt);

      return await res.status(201).send();
    });
  }
}
