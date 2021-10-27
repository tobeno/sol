import { Wrapper } from './wrapper';
import { browse } from '../integrations/browser';
import { URL, URLSearchParams } from 'url';

export class Url extends Wrapper<string> {
  constructor(value: string) {
    super(value);
  }

  get parsed(): URL {
    return new URL(this.value);
  }

  get protocol(): string {
    return this.parsed.protocol;
  }

  get hostname(): string {
    return this.parsed.hostname;
  }

  get port(): string {
    return this.parsed.port;
  }

  get query(): URLSearchParams {
    return this.parsed.searchParams;
  }

  get hash(): string {
    return this.parsed.hash;
  }

  browse(): void {
    browse(this);
  }
}
