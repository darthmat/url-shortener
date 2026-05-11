import { ValidationError } from '@/utils/errors.js';
import { nanoid } from 'nanoid';

export class Url {
  private static readonly minTitleLength = 3;
  private static readonly maxTitleLength = 100;
  readonly originalUrl: URL;
  readonly shortCode: string;
  readonly createdAt: Date;
  readonly expiresAt: Date | null;

  private constructor(readonly data: UrlData) {
    ({
      originalUrl: this.originalUrl,
      shortCode: this.shortCode,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
    } = data);
  }

  static create(data: UrlCreateDTO): Url {
    const url = new URL(data.originalUrl);

    if (data.originalUrl.length < this.minTitleLength) {
      throw new ValidationError(
        `Original URL must be at least ${this.minTitleLength} characters long`,
      );
    }

    if (data.originalUrl.length > this.maxTitleLength) {
      throw new ValidationError(
        `Original URL must be at most ${this.maxTitleLength} characters long`,
      );
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new ValidationError(
        'Original URL must start with http:// or https://',
      );
    }

    if (data.expiresAt && data.expiresAt <= new Date()) {
      throw new ValidationError('Expiration date must be in the future');
    }

    return new Url({
      originalUrl: url,
      shortCode: nanoid(8),
      createdAt: new Date(),
      expiresAt: data.expiresAt ?? null,
    });
  }

  static fromData(data: UrlData): Url {
    return new Url(data);
  }
}

export interface UrlData {
  originalUrl: URL;
  shortCode: string;
  createdAt: Date;
  expiresAt: Date | null;
}

interface UrlCreateDTO {
  originalUrl: string;
  expiresAt?: Date | null;
}
