import { csvToData, yamlToData, jsonToData } from './mapper';
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
import { file } from '../storage/file';
import { edit } from '../integrations/editor';
import { DataFormat } from './data-format';
import { DataSource } from './data-source';
import { DataTransformation } from './data-transformation';
import { File } from '../storage/file';
import { inspect } from 'util';

/**
 * Wrapper for strings
 */
export class Text extends String {
  constructor(
    value: string | String,
    public format: string | null = null,
    public source: DataSource | null = null,
    public sourceTransformation: DataTransformation | null = null,
  ) {
    super(value.toString());
  }

  get value() {
    return this.toString();
  }

  get rootSource(): DataSource | null {
    if (!this.source) {
      return null;
    }

    return this.source.rootSource || this.source;
  }

  get ext() {
    return DataFormat.toExt(this.format);
  }

  get text() {
    return this;
  }

  get lines() {
    return lines(this.toString());
  }

  get json() {
    return jsonToData(this);
  }

  get yaml() {
    return yamlToData(this);
  }

  get csv() {
    return csvToData(this);
  }

  withFormat(format: string | null): Text {
    this.format = format;

    return this;
  }

  withSource(source: DataSource | null): Text {
    this.source = source;

    return this;
  }

  grepLines(search: string | RegExp) {
    return new Text(grepLines(String(this), search));
  }

  rgrepLines(search: string | RegExp) {
    return new Text(rgrepLines(String(this), search));
  }

  sortLines() {
    return new Text(sortLines(String(this)));
  }

  rsortLines() {
    return new Text(rsortLines(String(this)));
  }

  filterLines(cb: (line: string) => boolean) {
    return new Text(filterLines(String(this), cb));
  }

  rfilterLines(cb: (line: string) => boolean) {
    return new Text(rfilterLines(String(this), cb));
  }

  replaceLines(pattern: string | RegExp, replacer: any) {
    return new Text(replaceLines(String(this), pattern, replacer));
  }

  mapLines(cb: (line: string) => any) {
    return new Text(mapLines(String(this), cb));
  }

  extract(pattern: string | RegExp): Text[] {
    return extractText(String(this), pattern).map((s) => new Text(s));
  }

  print() {
    console.log(this.toString());
  }

  edit() {
    return edit(this);
  }

  eval() {
    return eval(this.toString());
  }

  copy() {
    clipboard.text = this;
  }

  save() {
    const { rootSource } = this;
    if (rootSource instanceof File) {
      rootSource.text = this;
    }
  }

  saveAs(path: string) {
    const f = file(path);
    f.text = this;
    return f;
  }

  [inspect.custom]() {
    return this.toString();
  }
}
