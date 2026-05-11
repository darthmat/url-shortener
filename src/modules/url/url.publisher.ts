import EventEmitter from 'events';
import { IUrlEventPublisher } from './url.interface.js';

export const URL_ANALYTIC_EVENT = 'url-analytic';

export class UrlEventPublisher implements IUrlEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter) {}

  async urlAnalytic(shortUrl: string, ip: string): Promise<void> {
    this.eventEmitter.emit(URL_ANALYTIC_EVENT, { shortUrl, ip });
  }
}
