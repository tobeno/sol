import { DataFormat } from './data-format';
import { inspect } from 'util';
import {
  camelcaseText,
  capitalizeText,
  constantcaseText,
  decapitalizeText,
  extractText,
  filterLines,
  grepLines,
  kebabcaseText,
  lines,
  mapLines,
  pascalcaseText,
  replaceLines,
  rfilterLines,
  rgrepLines,
  rsortLines,
  sortLines,
  titlecaseText,
} from '../../utils/text';
import { Data } from './data';

/**
 * Wrapper for strings
 */
export class Text extends String {
  constructor(value: string | String, public format: string | null = null) {
    super(value.toString());
  }

  get value(): string {
    return this.toString();
  }

  get ext(): string {
    return DataFormat.toExt(this.format);
  }

  get text(): this {
    return this;
  }

  get camelcased(): Text {
    return Text.create(camelcaseText(this.value), this.format);
  }

  get pascalcased(): Text {
    return Text.create(pascalcaseText(this.value), this.format);
  }

  get constantcased(): Text {
    return Text.create(constantcaseText(this.value), this.format);
  }

  get titlecased(): Text {
    return Text.create(titlecaseText(this.value), this.format);
  }

  get kebabcased(): Text {
    return Text.create(kebabcaseText(this.value), this.format);
  }

  get uppercased(): Text {
    return Text.create(this.value.toUpperCase());
  }

  get lowercased(): Text {
    return Text.create(this.value.toLowerCase());
  }

  get capitalized(): Text {
    return Text.create(capitalizeText(this.value));
  }

  get decapitalized(): Text {
    return Text.create(decapitalizeText(this.value));
  }

  get lines(): Data<Text[]> {
    return Data.create(lines(this.toString()).map((line) => Text.create(line)));
  }

  grepLines(search: string | RegExp): Text {
    return Text.create(grepLines(String(this), search), this.format);
  }

  rgrepLines(search: string | RegExp): Text {
    return Text.create(rgrepLines(String(this), search), this.format);
  }

  sortLines(): Text {
    return Text.create(sortLines(String(this)), this.format);
  }

  rsortLines(): Text {
    return Text.create(rsortLines(String(this)), this.format);
  }

  filterLines(cb: (line: string) => boolean): Text {
    return Text.create(filterLines(String(this), cb), this.format);
  }

  rfilterLines(cb: (line: string) => boolean): Text {
    return Text.create(rfilterLines(String(this), cb), this.format);
  }

  replaceLines(pattern: string | RegExp, replacement: string): Text;
  replaceLines(
    pattern: string | RegExp,
    replacer: (...match: string[]) => string,
  ): Text;
  replaceLines(pattern: string | RegExp, replacer: any): Text {
    return Text.create(
      replaceLines(String(this), pattern, replacer),
      this.format,
    );
  }

  mapLines(cb: (line: string) => any): Text {
    return Text.create(mapLines(String(this), cb), this.format);
  }

  extract(pattern: string | RegExp): Data<Text[]> {
    return Data.create(
      extractText(String(this), pattern).map((s) => Text.create(s)),
    );
  }

  setFormat(format: string | null): this {
    this.format = format;

    return this;
  }

  eval<ReturnType = any>(): ReturnType {
    return eval(this.toString());
  }

  count(pattern: RegExp | string): number {
    if (!(pattern instanceof RegExp)) {
      pattern = new RegExp(pattern, 'g');
    }

    return [...this.value.matchAll(pattern)].length;
  }

  [inspect.custom](): string {
    return this.toString();
  }

  static create(
    value: Text | String | string,
    format: string | null = null,
  ): Text {
    if (value instanceof Text) {
      let text = value;

      if (format) {
        text = text.setFormat(format);
      }

      return text;
    }

    return new Text(value, format);
  }
}
