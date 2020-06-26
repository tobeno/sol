import { Expression } from 'jsonata';
import * as jsonata from 'jsonata';
import {
  wrapString,
  dataToJson,
  dataToYaml,
  dataToCsv,
  wrapObject,
} from './mapper';
import { Wrapper } from './wrapper';
import { Text } from './text';
import { WithSave } from '../wrappers/with-save';
import { WithPrint } from '../wrappers/with-print';
import { WithEdit } from '../wrappers/with-edit';
import { WithCopy } from '../wrappers/with-copy';
import { DataSource } from './data-source';
import { inspect } from 'util';
import { DataTransformation } from './data-transformation';

/**
 * Generic wrapper for runtime objects
 */
class UnwrappedData extends Wrapper {
  constructor(
    value: any,
    public source: DataSource | null = null,
    public sourceTransformation: DataTransformation | null = null,
  ) {
    super(value);
  }

  get rootSource(): DataSource | null {
    if (!this.source) {
      return null;
    }

    return this.source.rootSource || this.source;
  }

  get text(): Text {
    let value = this.value;
    if (!(value instanceof Text) && typeof value !== 'string') {
      value = this.json;
    }

    return wrapString(value, null, this);
  }

  get json(): Text {
    return dataToJson(this);
  }

  get yaml(): Text {
    return dataToYaml(this);
  }

  get csv(): Text {
    return dataToCsv(this);
  }

  get flattened() {
    if (Array.isArray(this.value)) {
      return wrapObject(this.value.flat(), this);
    }

    return this;
  }

  get unique() {
    if (Array.isArray(this.value)) {
      return wrapObject([...new Set(this.value)], this);
    }

    const knownValues: any[] = [];

    return this.filter((value: any) => {
      const result = !knownValues.includes(value);
      knownValues.push(value);
      return result;
    });
  }

  get sorted() {
    return this.sort();
  }

  get filtered(): Data {
    return this.filter((value: any) => !!value);
  }

  get keys(): any[] {
    if (Array.isArray(this.value)) {
      return this.value.map((_, index) => index);
    }

    return Object.keys(this.value);
  }

  get values(): any[] {
    if (Array.isArray(this.value)) {
      return this.value;
    }

    return Object.values(this.value);
  }

  get entries(): [string, any][] {
    return Object.entries(this.value);
  }

  withSource(source: DataSource | null): Data {
    this.source = source;

    return this as any;
  }

  sort(compareFn?: (a: any, b: any) => number): Data {
    if (Array.isArray(this.value)) {
      return wrapObject([...this.value].sort(compareFn), this);
    }

    const entries = this.entries;
    entries.sort(([aIndex, a], [bIndex, b]) => {
      if (compareFn) {
        return compareFn(a, b);
      }

      if (a < b) {
        return -1;
      }

      if (a > b) {
        return 1;
      }

      return 0;
    });

    return wrapObject(Object.fromEntries(entries), this);
  }

  filter(cb: (value: any, index: any) => any): Data {
    if (Array.isArray(this.value)) {
      return wrapObject(this.value.filter(cb), this);
    }

    const newValue: any = {};
    this.keys.forEach((index: any) => {
      const value = this.value[index];
      if (cb(value, index)) {
        newValue[index] = value;
      }
    });

    return wrapObject(newValue, this);
  }

  map(cb: (value: any, index: any) => any): Data {
    if (Array.isArray(this.value)) {
      return wrapObject(this.value.map(cb), this);
    }

    const newValue: any = {};
    this.keys.forEach((index: any) => {
      const value = this.value[index];
      newValue[index] = cb(value, index);
    });

    return wrapObject(newValue, this);
  }

  forEach(cb: (value: any, index: any) => any) {
    if (Array.isArray(this.value)) {
      return this.value.forEach(cb);
    }

    this.keys.forEach((index: any) => {
      const value = this.value[index];
      cb(value, index);
    });
  }

  transform(exp: string | Expression): Data {
    if (typeof exp === 'string') {
      exp = jsonata(exp);
    }

    return wrapObject(exp.evaluate(this.value), this);
  }

  [inspect.custom]() {
    return `Data ${inspect(this.value)}`;
  }
}

export class Data extends WithPrint(
  WithEdit(WithCopy(WithSave(UnwrappedData))),
) {}
