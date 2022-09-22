import { Wrapper } from './wrapper';
import { URL, URLSearchParams } from 'url';
import { Text } from './text';
import { transform } from '../transform/transformer';
import { DataTransformation } from '../transform/data-transformation';
import { DataType } from './data-type';

export class Url extends Wrapper<string> {
  constructor(value: string | URL) {
    if (value instanceof URL) {
      value = value.toJSON();
    }

    super(value);
  }

  get text(): Text {
    return Text.create(this.value);
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

  static create(value: string | String | Text | any): Url {
    if (value instanceof Url) {
      return value;
    }

    return transform(
      Text.create(value),
      new DataTransformation(DataType.Text, DataType.Url),
    );
  }
}
