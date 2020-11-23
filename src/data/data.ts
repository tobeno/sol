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
import { DataSource } from './data-source';
import { inspect } from 'util';
import { DataTransformation } from './data-transformation';
import { clipboard } from '../os/clipboard';
import { AnyItemType, AnyKeyType, AnyPartial } from '../interfaces/util';
import { edit } from '../integrations/editor';
import { File } from '../storage/file';
import { save, saveAs } from '../storage/save';
import { camelcaseObject, snakecaseObject } from '../utils/object';

/**
 * Generic wrapper for runtime objects
 */
export class Data<
  ValueType = any,
  ItemType = AnyItemType<ValueType>,
  KeyType = AnyKeyType<ValueType>
> extends Wrapper<ValueType> {
  constructor(
    value: ValueType,
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

  get text(): Text<ValueType> {
    let value = this.value as any;
    if (!(value instanceof Text) && typeof value !== 'string') {
      value = this.json;
    }

    return wrapString(value, null, this);
  }

  get json(): Text<ValueType> {
    return dataToJson<ValueType>(this);
  }

  get yaml(): Text<ValueType> {
    return dataToYaml<ValueType>(this);
  }

  get csv(): Text<ValueType> {
    return dataToCsv<ValueType>(this);
  }

  get clone(): Data<ValueType> {
    return wrapObject<ValueType>(JSON.parse(JSON.stringify(this.value)), this);
  }

  get flattened(): Data<
    ValueType extends Array<any> ? FlatArray<ValueType, 1> : ValueType
  > {
    if (Array.isArray(this.value)) {
      return wrapObject(this.value.flat() as any, this) as any;
    }

    return this as any;
  }

  get unique(): Data<AnyPartial<ValueType>> {
    if (Array.isArray(this.value)) {
      return wrapObject([...new Set(this.value)] as any, this) as any;
    }

    const knownValues: any[] = [];

    return this.filter((value: any) => {
      const result = !knownValues.includes(value);
      knownValues.push(value);
      return result;
    });
  }

  get sorted(): Data<ValueType extends Array<any> ? ValueType : any> {
    return this.sort();
  }

  get filtered(): Data<AnyPartial<ValueType>> {
    return this.filter((value: any) => !!value);
  }

  get camelcased(): Data<any> {
    return wrapObject(camelcaseObject(this.value), this) as any;
  }

  get snakecased(): Data<any> {
    return wrapObject(snakecaseObject(this.value), this) as any;
  }

  get keys(): KeyType[] {
    if (Array.isArray(this.value)) {
      return (this.value as any).map((_: any, index: any) => index) as any;
    }

    return Object.keys(this.value) as any;
  }

  get values(): ItemType[] {
    if (Array.isArray(this.value)) {
      return this.value as any;
    }

    return Object.values(this.value);
  }

  get entries(): [KeyType, ItemType][] {
    if (Array.isArray(this.value)) {
      return this.value.entries() as any;
    }

    return Object.entries(this.value) as any;
  }

  withSource(source: DataSource | null): Data<ValueType> {
    this.source = source;

    return this as any;
  }

  sort(
    compareFn?: (a: ItemType, b: ItemType) => number,
  ): Data<ValueType extends Array<any> ? ValueType : any> {
    if (Array.isArray(this.value)) {
      return wrapObject([...this.value].sort(compareFn), this) as any;
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

    return wrapObject(Object.fromEntries(entries), this) as any;
  }

  filter(
    cb: (value: ItemType, index: KeyType) => boolean,
  ): Data<AnyPartial<ValueType>> {
    if (Array.isArray(this.value)) {
      return wrapObject(this.value.filter(cb as any) as any, this) as any;
    }

    const newValue: any = {};
    this.keys.forEach((index: any) => {
      const value = (this.value as any)[index];
      if (cb(value, index)) {
        newValue[index] = value;
      }
    });

    return wrapObject(newValue, this) as any;
  }

  find(cb: (value: ItemType, index: KeyType) => boolean): Data<ItemType> {
    if (Array.isArray(this.value)) {
      return wrapObject(this.value.find(cb as any) as any, this) as any;
    }

    let result: any = null;
    for (const index of this.keys) {
      const value = (this.value as any)[index];
      if (cb(value, index)) {
        result = value;

        break;
      }
    }

    return result ? (wrapObject(result, this) as any) : null;
  }

  findIndex(cb: (value: ItemType, index: KeyType) => boolean): Data<KeyType> {
    if (Array.isArray(this.value)) {
      return wrapObject(this.value.findIndex(cb as any) as any, this) as any;
    }

    let result: any = null;
    for (const index of this.keys) {
      const value = (this.value as any)[index];
      if (cb(value, index)) {
        result = index;

        break;
      }
    }

    return result ? (wrapObject(result, this) as any) : null;
  }

  some(cb: (value: ItemType, index: KeyType) => boolean): boolean {
    if (Array.isArray(this.value)) {
      return this.value.some(cb as any);
    }

    let result = false;
    for (const index of this.keys) {
      const value = (this.value as any)[index];
      if (cb(value, index)) {
        result = true;

        break;
      }
    }

    return result;
  }

  every(cb: (value: ItemType, index: KeyType) => boolean): boolean {
    if (Array.isArray(this.value)) {
      return this.value.every(cb as any);
    }

    let result = true;
    for (const index of this.keys) {
      const value = (this.value as any)[index];
      if (!cb(value, index)) {
        result = false;

        break;
      }
    }

    return result;
  }

  map<MappedItemType = any>(
    cb: (value: ItemType, index: KeyType) => MappedItemType,
  ): Data<
    ValueType extends Array<any>
      ? MappedItemType[]
      : ValueType extends Record<string, any>
      ? { [key: string]: MappedItemType }
      : any
  > {
    if (Array.isArray(this.value)) {
      return wrapObject((this.value as any).map(cb as any) as any, this) as any;
    }

    const newValue: any = {};
    this.keys.forEach((index: any) => {
      const value = (this.value as any)[index];
      newValue[index] = cb(value, index);
    });

    return wrapObject(newValue, this) as any;
  }

  join(separator: string): Text {
    if (Array.isArray(this.value)) {
      return wrapString(this.value.join(separator), null, this);
    }

    return wrapString(Object.values(this.value).join(separator), null, this);
  }

  forEach(cb: (value: ItemType, index: KeyType) => any) {
    if (Array.isArray(this.value)) {
      return this.value.forEach(cb as any);
    }

    this.keys.forEach((index: any) => {
      const value = (this.value as any)[index];
      cb(value, index);
    });
  }

  transform<TransformedValueType = any>(
    exp: string | Expression,
  ): Data<TransformedValueType> {
    if (typeof exp === 'string') {
      exp = jsonata(exp);
    }

    return wrapObject(exp.evaluate(this.value), this) as any;
  }

  copy() {
    clipboard.text = String(this);
  }

  edit(): File {
    return edit(this);
  }

  print() {
    console.log(String(this));
  }

  saveAs(path: string): File {
    return saveAs(this, path);
  }

  save(): File {
    return save(this);
  }

  [inspect.custom]() {
    return `Data ${inspect(this.value)}`;
  }
}
