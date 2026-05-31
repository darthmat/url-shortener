import { FastifyBaseLogger, FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UrlDTO } from './url.dto.js';
import { IUrlEventPublisher, IUrlService } from './url.interface.js';
import {
  errorSchema,
  rateLimitSchema,
  urlBodySchema,
  urlDTOSchema,
  urlParamsSchema,
} from './url.schema.js';

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
        const url = await this.urlService.getUrl(shortCode);

        // Intentionally — we track all access attempts
        this.urlEventPublisher
          .urlAnalytic(shortCode, req.ip)
          .catch((err: unknown) => {
            this.log.error(
              { err, shortCode },
              'Failed to publish analytic event',
            );
          });

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
