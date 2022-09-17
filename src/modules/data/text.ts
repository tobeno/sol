import { DataFormat } from './data-format';
import { inspect } from 'util';
import {
  camelcaseText,
  capitalizeText,
  constantcaseText,
  decapitalizeText,
  kebabcaseText,
  pascalcaseText,
  titlecaseText,
} from '../utils/text';

/**
 * Wrapper for strings
 */
export class Text<ContentType = any> extends String {
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

  get camelcased(): Text<ContentType> {
    return new Text<ContentType>(camelcaseText(this.value), this.format);
  }

  get pascalcased(): Text<ContentType> {
    return new Text<ContentType>(pascalcaseText(this.value), this.format);
  }

  get constantcased(): Text<ContentType> {
    return new Text<ContentType>(constantcaseText(this.value), this.format);
  }

  get titlecased(): Text<ContentType> {
    return new Text<ContentType>(titlecaseText(this.value), this.format);
  }

  get kebabcased(): Text<ContentType> {
    return new Text<ContentType>(kebabcaseText(this.value), this.format);
  }

  get uppercased(): Text<ContentType> {
    return new Text<ContentType>(this.value.toUpperCase());
  }

  get lowercased(): Text<ContentType> {
    return new Text<ContentType>(this.value.toLowerCase());
  }

  get capitalized(): Text<ContentType> {
    return new Text<ContentType>(capitalizeText(this.value));
  }

  get decapitalized(): Text<ContentType> {
    return new Text<ContentType>(decapitalizeText(this.value));
  }

  setFormat(format: string | null): this {
    this.format = format;

    return this;
  }

  eval(): any {
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
}

export function wrapString<ContentType = any>(
  value: string | String | Text,
  format: string | null = null,
): Text<ContentType> {
  if (value instanceof Text) {
    let text = value;

    if (format) {
      text = text.setFormat(format);
    }

    return text;
  }

  return new Text(value, format);
}

export function unwrapString(value: string | String | Text): string {
  return String(value);
}
