import { ValidationError } from '@/utils/errors.js';
import { nanoid } from 'nanoid';

export class Url {
  private static readonly minTLDLength = 2;
  private static readonly minDomainLength = 2;
  readonly originalUrl: URL;
  readonly shortCode: string;
  readonly createdAt: Date;
  readonly expiresAt: Date | null;

  private constructor(data: UrlData) {
    this.originalUrl = data.originalUrl;
    this.shortCode = data.shortCode;
    this.createdAt = data.createdAt;
    this.expiresAt = data.expiresAt;
  }

  static create(data: UrlCreateDTO): Url {
    const url = new URL(data.originalUrl);
    const tld = url.hostname.split('.').at(-1);
    const domain = url.hostname.split('.').at(-2);

    if (!url.hostname.includes('.')) {
      throw new ValidationError('Invalid URL: must contain a valid domain');
    }

    if (!tld || tld.length < this.minTLDLength) {
      throw new ValidationError(
        'Invalid URL: TLD must be at least 2 characters',
      );
    }

    if (!domain || domain.length < this.minDomainLength) {
      throw new ValidationError(
        'Invalid URL: domain must be at least 2 characters',
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

  isExpired(): boolean {
    return !!this.expiresAt && this.expiresAt < new Date();
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
