import { Wrapper } from './wrapper';
import { URL, URLSearchParams } from 'url';
import { Text, wrapString } from './text';
import { DataSource } from './data-source';
import { DataTransformation } from './data-transformation';
import { DataType } from './data-type';
import { transform } from './transformer';

export class Url extends Wrapper<string> {
  constructor(value: string | URL) {
    if (value instanceof URL) {
      value = value.toJSON();
    }

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
}

export function wrapUrl(
  value: string | String | Text,
  source: DataSource | null = null,
): Url {
  return transform(
    wrapString(value, null, source),
    new DataTransformation(DataType.Text, DataType.Url),
  );
}

export function unwrapUrl<ContentType = any>(value: Url): Text<ContentType> {
  return wrapString(value.value);
}
