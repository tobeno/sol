import { Wrapper } from './wrapper';
import { Text } from './text';
import { DataFormat } from './data-format';
import type { CheerioAPI } from 'cheerio';
import { inspect } from 'util';

export class Xml extends Wrapper<CheerioAPI> {
  constructor(value: string, public format: string | null = null) {
    const cheerio = require('cheerio') as typeof import('cheerio');

    super(
      cheerio.load(value, {
        xml: true,
      }),
    );
  }

  get text(): Text {
    return Text.create(this.value.html(), DataFormat.Html);
  }

  select(selector: Parameters<CheerioAPI>[0]) {
    return this.value(selector);
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom](): string {
    return `Xml { ${this.text} }`;
  }

  toString(): string {
    return this.text.value;
  }

  static create(value: Text | String | string | any): Xml {
    if (value instanceof Xml) {
      return value;
    }

    return new Xml(String(value));
  }
}
