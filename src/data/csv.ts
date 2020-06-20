import { inspect } from 'util';
import * as Papa from 'papaparse';
import { WithAllText } from '../wrappers/with-all-text';
import { json } from './json';

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

  get json() {
    return json(this.data);
  }

  sortColumn(column: string) {
    this.data.sort((a, b) => {
      if (a[column] < b[column]) {
        return -1;
      }

      if (a[column] > b[column]) {
        return -1;
      }

      return 0;
    });

    return this;
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return this.toString();
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

export function csv(data: string | any[]) {
  return new Csv(data);
}
