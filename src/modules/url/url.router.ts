import { FastifyBaseLogger, FastifyInstance } from 'fastify';
import { IUrlEventPublisher, IUrlService } from './url.interface.js';
import { EntityNotFoundError, ExpiredError } from '@/utils/errors.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  urlParamsSchema,
  urlBodySchema,
  urlDTOSchema,
  rateLimitSchema,
  errorSchema,
} from './url.schema.js';
import { UrlDTO } from './url.dto.js';

export class UrlRouter {
  constructor(
    private readonly urlService: IUrlService,
    private readonly urlEventPublisher: IUrlEventPublisher,
    private readonly log: FastifyBaseLogger,
  ) {}
  register(fastify: FastifyInstance) {
    const server = fastify.withTypeProvider<ZodTypeProvider>();

    server.get(
      '/urls/:shortCode',
      {
        schema: {
          tags: ['URL'],
          params: urlParamsSchema,
          response: {
            404: errorSchema,
            410: errorSchema,
            429: rateLimitSchema,
          },
        },
      },
      async (req, res) => {
        const { shortCode } = req.params;
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

        if (url.expiresAt && url.expiresAt < new Date()) {
          throw new ExpiredError('URL has expired');
        }

        return await res.redirect(url.originalUrl, 302);
      },
    );

    server.post(
      '/urls',
      {
        schema: {
          tags: ['URL'],
          body: urlBodySchema,
          response: {
            201: urlDTOSchema,
            429: rateLimitSchema,
          },
        },
      },
      async (req, res): Promise<UrlDTO> => {
        const { originalUrl, expiresAt } = req.body;

        const url = await this.urlService.shortenUrl(originalUrl, expiresAt);

        return await res.status(201).send(url);
      },
    );
  }
}
