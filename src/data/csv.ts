import { inspect } from 'util';
import * as Papa from 'papaparse';
import { WithAllText } from '../extensions/all-text';

export class UnwrappedCsv {
  data: any[];

  constructor(data: string | any[]) {
    if (typeof data === 'string') {
      data = UnwrappedCsv.parse(data, {
        header: true,
      });
    }

    this.data = data;
  }

  get header(): string[] {
    return this.data.length ? Object.keys(this.data[0]) : [];
  }

  get rows(): any[][] {
    return this.data.map((item) =>
      this.header.map((name) => item[name] || null),
    );
  }

  set text(value: string) {
    this.data = UnwrappedCsv.parse(value, {
      header: true,
    });
  }

  get text(): string {
    return this.toString();
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return this.data;
  }

  toString() {
    return UnwrappedCsv.stringify(this.data, {
      header: true,
    });
  }

  static parse<T = string[]>(data: string, options?: Papa.ParseConfig): T[] {
    return Papa.parse<T>(data, options).data;
  }

  static stringify(data: any[], options?: Papa.UnparseConfig): string {
    return Papa.unparse(data, options);
  }
}

export class Csv extends WithAllText(UnwrappedCsv) {}

export function csv(data: string) {
  return new Csv(data);
}