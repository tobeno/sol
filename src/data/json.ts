import * as jsonata from 'jsonata';
import { inspect } from 'util';
import { WithFile } from '../extensions/file';
import { WithVscode } from '../extensions/vscode';
import { WithPrint } from '../extensions/print';
import { WithCopy } from '../extensions/copy';
import { WithText } from '../extensions/text';

export class UnwrappedJson {
  constructor(public data: any) {}

  get text() {
    return JSON.stringify(this.data, null, 2);
  }

  set text(value: string) {
    this.data = JSON.parse(value);
  }

  get keys() {
    if (Array.isArray(this.data)) {
      return this.data.map((_, index) => index);
    }

    return Object.keys(this.data);
  }

  get values() {
    if (Array.isArray(this.data)) {
      return this.data;
    }

    return Object.values(this.data);
  }

  transform(exp: string | jsonata.Expression): Json {
    if (typeof exp === 'string') {
      exp = jsonata(exp);
    }

    return new Json(exp.evaluate(this.data));
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return this.data;
  }
}

export class Json extends WithText(
  WithCopy(WithPrint(WithVscode(WithFile(UnwrappedJson)))),
) {}
