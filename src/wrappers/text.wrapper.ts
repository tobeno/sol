import { inspect } from 'util';
import type { MaybeWrapped } from '../interfaces/wrapper.interfaces';
import { compressString, decompressString } from '../utils/compress.utils';
import { log } from '../utils/log.utils';
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
  snakecaseText,
  sortLines,
  titlecaseText,
} from '../utils/text.utils';
import { DataFormat } from './data-format.wrapper';
import { Data } from './data.wrapper';
import { Wrapper } from './wrapper.wrapper';

/**
 * Wrapper for strings.
 */
export class Text extends Wrapper<string> {
  constructor(
    value: string,
    public format: string | null = null,
  ) {
    super(value.toString());
  }

  /**
   * Returns the extension for the format of this text.
   */
  get ext(): string {
    return DataFormat.toExt(this.format);
  }

  get text(): this {
    return this;
  }

  /**
   * Returns the text converted to camelCase.
   */
  get camelcased(): Text {
    return Text.create(camelcaseText(this.value), this.format);
  }

  /**
   * Returns the text converted to snake_case.
   */
  get snakecased(): Text {
    return Text.create(snakecaseText(this.value), this.format);
  }

  /**
   * Returns the text converted to PascalCase.
   */
  get pascalcased(): Text {
    return Text.create(pascalcaseText(this.value), this.format);
  }

  /**
   * Returns the text converted to CONSTANT_CASE.
   */
  get constantcased(): Text {
    return Text.create(constantcaseText(this.value), this.format);
  }

  /**
   * Returns the text converted to Title Case.
   */
  get titlecased(): Text {
    return Text.create(titlecaseText(this.value), this.format);
  }

  /**
   * Returns the text converted to kebab-case.
   */
  get kebabcased(): Text {
    return Text.create(kebabcaseText(this.value), this.format);
  }

  /**
   * Returns the text converted to upper case.
   */
  get uppercased(): Text {
    return Text.create(this.value.toUpperCase());
  }

  /**
   * Returns the text converted to lower case.
   */
  get lowercased(): Text {
    return Text.create(this.value.toLowerCase());
  }

  /**
   * Returns the text with the first letter capitalized.
   */
  get capitalized(): Text {
    return Text.create(capitalizeText(this.value));
  }

  /**
   * Returns the text with the first letter decapitalized.
   */
  get decapitalized(): Text {
    return Text.create(decapitalizeText(this.value));
  }

  /**
   * Returns the text URL-encoded.
   */
  get urlencoded(): Text {
    return Text.create(encodeURIComponent(this.value));
  }

  /**
   * Returns the text URL-decoded.
   */
  get urldecoded(): Text {
    return Text.create(decodeURIComponent(this.value));
  }

  /**
   * Returns the text in base 64 encoding.
   */
  get base64encoded(): Text {
    return Text.create(Buffer.from(this.value).toString('base64url'));
  }

  /**
   * Returns the text converted from base 64 encoding.
   */
  get base64decoded(): Text {
    return Text.create(Buffer.from(this.value, 'base64url').toString('utf8'));
  }

  get compressed(): Text {
    return Text.create(compressString(this.value));
  }

  get decompressed(): Text {
    return Text.create(decompressString(this.value));
  }

  /**
   * Returns the text trimmed.
   */
  get trimmed(): Text {
    return Text.create(this.value.trim());
  }

  /**
   * Returns the text as a number.
   */
  get number(): number {
    return Number(this.value);
  }

  get buffer(): Buffer {
    return Buffer.from(this.value);
  }

  /**
   * Logs the text to the console.
   */
  get logged(): this {
    log(this.toString());

    return this;
  }

  /**
   * Returns all lines of the text.
   */
  get lines(): Data<Text[]> {
    return Data.create(lines(this.toString()).map((line) => Text.create(line)));
  }

  /**
   * Returns the length of the text.
   */
  get length(): number {
    return this.value.length;
  }

  /**
   * Returns all lines of the text matching the given (RegExp) pattern.
   */
  grepLines(search: string | RegExp): Text {
    return Text.create(grepLines(String(this), search), this.format);
  }

  /**
   * Returns all lines of the text not matching the given (RegExp) pattern.
   */
  rgrepLines(search: string | RegExp): Text {
    return Text.create(rgrepLines(String(this), search), this.format);
  }

  /**
   * Returns all lines sorted.
   */
  sortLines(): Text {
    return Text.create(sortLines(String(this)), this.format);
  }

  /**
   * Returns all lines sorted in reverse order.
   */
  rsortLines(): Text {
    return Text.create(rsortLines(String(this)), this.format);
  }

  /**
   * Returns all lines filtered by the given callback.
   */
  filterLines(cb: (line: string) => boolean): Text {
    return Text.create(filterLines(String(this), cb), this.format);
  }

  /**
   * Returns all lines filtered by the given callback (excluding matches).
   */
  rfilterLines(cb: (line: string) => boolean): Text {
    return Text.create(rfilterLines(String(this), cb), this.format);
  }

  /**
   * Returns all lines with the pattern replaced by the replacement.
   */
  replaceLines(pattern: string | RegExp, replacement: string): Text;
  /**
   * Returns all lines with the pattern replaced by the replacer.
   */
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

  /**
   * Returns the text with the pattern replaced by the replacement.
   */
  replace(pattern: string | RegExp, replacement: string): Text;
  /**
   * Returns the text with the pattern replaced by the replacer.
   */
  replace(
    pattern: string | RegExp,
    replacer: (...match: string[]) => string,
  ): Text;
  replace(...args: any): Text {
    return Text.create(this.value.replace.apply(this.value, args));
  }

  /**
   * Returns the text repeated by the given times.
   */
  repeat(...args: Parameters<String['repeat']>): Text {
    return Text.create(this.value.repeat(...args));
  }

  /**
   * Matches the text against the given (RegExp) pattern returning the first result.
   */
  match(...args: Parameters<String['match']>): ReturnType<String['match']> {
    return this.value.match(...args);
  }

  /**
   * Matches the text against the given (RegExp) pattern returning all results.
   */
  matchAll(...args: Parameters<String['matchAll']>): Data<RegExpMatchArray> {
    return Data.create([...this.value.matchAll(...args)]) as any;
  }

  /**
   * Returns the text sliced at the given start and end.
   */
  slice(...args: Parameters<String['slice']>): Text {
    return Text.create(this.value.slice(...args));
  }

  /**
   * Fills the text to the given length from the start.
   */
  padStart(...args: Parameters<String['padStart']>): Text {
    return Text.create(this.value.padStart(...args));
  }

  /**
   * Fills the text to the given length from the end.
   */
  padEnd(...args: Parameters<String['padEnd']>): Text {
    return Text.create(this.value.padEnd(...args));
  }

  /**
   * Returns true if the text contains the given string.
   */
  includes(...args: Parameters<String['includes']>): boolean {
    return this.value.includes(...args);
  }

  /**
   * Returns true if the text starts with the given string.
   */
  startsWith(...args: Parameters<String['startsWith']>): boolean {
    return this.value.startsWith(...args);
  }

  /**
   * Returns true if the text ends with the given string.
   */
  endsWith(...args: Parameters<String['startsWith']>): boolean {
    return this.value.endsWith(...args);
  }

  /**
   * Returns the index of the given string or a negative value if not found.
   */
  indexOf(...args: Parameters<String['indexOf']>): number {
    return this.value.indexOf(...args);
  }

  /**
   * Returns the last index of the given string or a negative value if not found.
   */
  lastIndexOf(...args: Parameters<String['lastIndexOf']>): number {
    return this.value.lastIndexOf(...args);
  }

  /**
   * Splits the string by the given separator.
   */
  split(separator: string | RegExp, limit?: number): Data<Text[]> {
    return Data.create(
      this.value.split(separator, limit).map((value) => Text.create(value)),
    );
  }

  /**
   * Maps all lines of the text using the given callback.
   */
  mapLines(cb: (line: string) => any): Text {
    return Text.create(mapLines(String(this), cb), this.format);
  }

  /**
   * Returns the first match of the given (RegExp) pattern.
   */
  select(pattern: string | RegExp): Text | null {
    return this.selectAll(pattern).value[0] || null;
  }

  /**
   * Returns the first match that is a code block (just the content) or the full text if it is a JSON.
   */
  selectCode(): Text | null {
    let code: Text | null;
    if (!this.includes('```')) {
      code = this;
    } else {
      code =
        this?.select(/```.*\n([\s\S]+?)\n[ \t]*```/)
          ?.split('\n')
          .slice(1, -1)
          .join('\n').trimmed || null;
    }

    if (!code) {
      return null;
    }

    if (!!code.match(/^[{[][\s\S]*[\]}]$/)) {
      code.setFormat(DataFormat.Json);
    }

    return code;
  }

  /**
   * Returns the first match of the given (RegExp) pattern.
   */
  selectAll(pattern: string | RegExp): Data<Text[]> {
    return Data.create(
      extractText(String(this), pattern).map((s) => Text.create(s)),
    );
  }

  /**
   * Sets the data format of the text.
   */
  setFormat(format: string | null): this {
    this.format = format;

    return this;
  }

  /**
   * Returns the number of matches of the given (RegExp) pattern.
   */
  count(pattern: RegExp | string): number {
    if (!(pattern instanceof RegExp)) {
      pattern = new RegExp(pattern, 'g');
    }

    return [...this.value.matchAll(pattern)].length;
  }

  [inspect.custom](): string {
    return this.toString();
  }

  toString(): string {
    return this.value;
  }

  static create(
    value: MaybeWrapped<string>,
    format: string | null = null,
  ): Text {
    if (value instanceof Text) {
      let text = value;

      if (format) {
        text = text.setFormat(format);
      }

      return text;
    } else {
      value = String(value);
    }

    return new Text(value, format);
  }
}
