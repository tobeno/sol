import {
  csvToData,
  yamlToData,
  jsonToData,
  wrapObject,
  wrapString,
} from './transformer';
import {
  lines,
  grepLines,
  rgrepLines,
  sortLines,
  rsortLines,
  filterLines,
  rfilterLines,
  replaceLines,
  mapLines,
  extractText,
} from '../utils/text';
import { clipboard } from '../os/clipboard';
import { edit } from '../integrations/editor';
import { DataFormat } from './data-format';
import { DataSource } from './data-source';
import { DataTransformation } from './data-transformation';
import { File } from '../storage/file';
import { inspect } from 'util';
import { Data } from './data';
import { save, saveAs } from '../storage/save';

/**
 * Wrapper for strings
 */
export class Text<ContentType = any> extends String {
  constructor(
    value: string | String,
    public format: string | null = null,
    public source: DataSource | null = null,
    public sourceTransformation: DataTransformation | null = null,
  ) {
    super(value.toString());
  }

  get value(): string {
    return this.toString();
  }

  get rootSource(): DataSource | null {
    if (!this.source) {
      return null;
    }

    return this.source.rootSource || this.source;
  }

  get ext(): string {
    return DataFormat.toExt(this.format);
  }

  get text(): this {
    return this;
  }

  get lines(): Data<string[]> {
    return wrapObject(lines(this.toString()), this);
  }

  get json(): Data<ContentType> {
    return jsonToData(this);
  }

  get yaml(): Data<ContentType> {
    return yamlToData(this);
  }

  get csv(): Data<ContentType> {
    return csvToData(this);
  }

  withFormat(format: string | null): this {
    this.format = format;

    return this;
  }

  withSource(source: DataSource | null): this {
    this.source = source;

    return this;
  }

  grepLines(search: string | RegExp): Text<ContentType> {
    return wrapString(grepLines(String(this), search), this.format, this);
  }

  rgrepLines(search: string | RegExp): Text<ContentType> {
    return wrapString(rgrepLines(String(this), search), this.format, this);
  }

  sortLines(): Text<ContentType> {
    return wrapString(sortLines(String(this)), this.format, this);
  }

  rsortLines(): Text<ContentType> {
    return wrapString(rsortLines(String(this)), this.format, this);
  }

  filterLines(cb: (line: string) => boolean): Text<ContentType> {
    return wrapString(filterLines(String(this), cb), this.format, this);
  }

  rfilterLines(cb: (line: string) => boolean): Text<ContentType> {
    return wrapString(rfilterLines(String(this), cb), this.format, this);
  }

  replaceLines(pattern: string | RegExp, replacer: any): Text<ContentType> {
    return wrapString(
      replaceLines(String(this), pattern, replacer),
      this.format,
      this,
    );
  }

  mapLines(cb: (line: string) => any): Text<ContentType> {
    return wrapString(mapLines(String(this), cb), this.format, this);
  }

  extract(pattern: string | RegExp): Data<Text[]> {
    return wrapObject(
      extractText(String(this), pattern).map((s) => wrapString(s)),
      this,
    );
  }

  print(): void {
    console.log(this.toString());
  }

  edit(): File {
    return edit(this);
  }

  eval(): any {
    return eval(this.toString());
  }

  copy(): void {
    clipboard.text = this;
  }

  saveAs(path: string): File {
    return saveAs(this, path);
  }

  save(): File {
    return save(this);
  }

  [inspect.custom]() {
    return this.toString();
  }
}
