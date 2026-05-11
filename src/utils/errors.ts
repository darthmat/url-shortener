import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export class ValidationError extends Error {
  constructor(readonly error: string) {
    super(`Validation failed: ${error}`);
    this.name = 'ValidationError';
  }
}

export class InternalError extends Error {
  constructor(cause?: unknown) {
    super('An internal error occurred.', { cause });
    this.name = 'InternalError';
  }
}

export class UnavailableServiceError extends Error {
  constructor(readonly error: string) {
    super(`Service Unavailable: ${error}`);
    this.name = 'UnavailableService';
  }
}

export class EntityNotFoundError extends Error {
  constructor(message: string);
  constructor(entityName: string, entityId: number | string);
  constructor(
    readonly messageOrEntityName: string,
    readonly entityId?: number | string,
  ) {
    super(
      entityId === undefined
        ? messageOrEntityName
        : `Entity ${messageOrEntityName} with ID ${entityId} not found.`,
    );
    this.name = 'EntityNotFoundError';
  }
}

export function errorHandler(
  err: FastifyError,
  _req: FastifyRequest,
  res: FastifyReply,
): void {
  if (err instanceof EntityNotFoundError) {
    res.status(404).send({ message: err.message });
    return;
  }

  if (err instanceof InternalError) {
    res.status(500).send({ message: err.message });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).send({ message: err.message });
    return;
  }

  if (err instanceof UnavailableServiceError) {
    res.status(503).send({
      message: err.message,
    });
    return;
  }

  res.status(500).send({ message: 'An unexpected error occurred.' });
}
