import type jsonata from 'jsonata';
import { inspect } from 'util';
import type { AnyItem, AnyKeyType, AnyPartial } from '../interfaces/util';
import {
  chunkArray,
  diffArray,
  intersectArray,
  unionArray,
} from '../utils/array';
import { isEmpty, isNotEmpty } from '../utils/core';
import { unwrap } from '../utils/data';
import { dereferenceJsonSchema } from '../utils/json-schema';
import { log } from '../utils/log';
import {
  cloneObjectDeep,
  diffObjectKeys,
  equalsObjectDeep,
  flattenObject,
  intersectObjectKeys,
  mapObjectKeys,
  traverseObjectDeep,
  unionObjectKeys,
} from '../utils/object';
import {
  camelcaseText,
  constantcaseText,
  kebabcaseText,
  pascalcaseText,
  snakecaseText,
  titlecaseText,
} from '../utils/text';
import { Text } from './text';
import { Wrapper } from './wrapper';

/**
 * Generic wrapper for runtime objects.
 */
export class Data<
  ValueType = any,
  ItemType = AnyItem<ValueType>,
  KeyType = AnyKeyType<ValueType>,
> extends Wrapper<ValueType> {
  constructor(value: ValueType) {
    super(value);
  }

  /**
   * Returns a clone of this data
   */
  get cloned(): Data<ValueType> {
    return Data.create(JSON.parse(JSON.stringify(this.value))) as any;
  }

  /**
   * Returns the data flattened.
   *
   * Two behaviours:
   * - For arrays: Flattens the array by one level.
   * - For objects: Flattens all nested objects while ignoring arrays.
   */
  get flattened(): Data<
    ValueType extends Array<any> ? FlatArray<ValueType, 1> : ValueType
  > {
    if (Array.isArray(this.value)) {
      return Data.create(this.value.flat() as any) as any;
    }

    return Data.create(flattenObject(this.value)) as any;
  }

  /**
   * Returns the first item.
   */
  get first(): Data<ItemType> | null {
    if (Array.isArray(this.value)) {
      return this.value.length ? (Data.create(this.value[0]) as any) : null;
    }

    const values = Object.values(this.value as any);

    return values.length ? (Data.create(values[0]) as any) : null;
  }

  /**
   * Returns the last item.
   */
  get last(): Data<ItemType> | null {
    if (Array.isArray(this.value)) {
      return this.value.length
        ? (Data.create(this.value[this.value.length - 1]) as any)
        : null;
    }

    const values = Object.values(this.value as any);

    return values.length
      ? (Data.create(values[values.length - 1]) as any)
      : null;
  }

  /**
   * Returns the sum of all values.
   */
  get sum(): number {
    const values = this.values;

    return values.reduce(
      (result, value) => result + (parseFloat(value as any) || 0),
      0,
    ).value;
  }

  /**
   * Returns the average of all values.
   */
  get avg(): number {
    const values = this.values;

    return Data.create(values.sum / values.length).value as any;
  }

  /**
   * Returns the minimum of all values.
   */
  get min(): number {
    const values = this.values.value;

    return Math.min(...values.map((value) => Number(value)));
  }

  /**
   * Returns the maximum of all values.
   */
  get max(): number {
    const values = this.values.value;

    return Math.max(...values.map((value) => Number(value)));
  }

  /**
   * Returns the data with all values unique.
   *
   * Two behaviours:
   * - For arrays: Returns the array with all duplicates removed.
   * - For objects: Returns the object with all duplicate values removed.
   */
  get unique(): Data<AnyPartial<ValueType>> {
    const knownValues: any[] = [];

    return this.filter((value: any) => {
      const unwrappedValue = unwrap(value);
      const result = !knownValues.includes(unwrappedValue);
      knownValues.push(unwrappedValue);
      return result;
    });
  }

  /**
   * Returns the data sorted by its values.
   */
  get sorted(): Data<ValueType extends Array<any> ? ValueType : any> {
    return this.sort();
  }

  /**
   * Returns the data sorted by its keys.
   */
  get sortedKeys(): Data<ValueType extends Array<any> ? ValueType : any> {
    return this.sortKeys();
  }

  /**
   * Returns the data as joined string.
   */
  get joined(): Text {
    return this.join('\n');
  }

  /**
   * Returns the data in reversed order.
   */
  get reversed(): Data<ValueType extends Array<any> ? ValueType : any> {
    if (Array.isArray(this.value)) {
      return Data.create(this.value.reverse()) as any;
    }

    return Data.create(
      Object.fromEntries(Object.entries(this.value as any).reverse()),
    ) as any;
  }

  /**
   * Returns the data with falsy values removed.
   */
  get filtered(): Data<AnyPartial<ValueType>> {
    return this.filter(isNotEmpty);
  }

  /**
   * Returns the data in camelCase.
   */
  get camelcased(): Data {
    return this.changeCase(camelcaseText);
  }

  /**
   * Returns the data in snake_case.
   */
  get snakecased(): Data {
    return this.changeCase(snakecaseText);
  }

  /**
   * Returns the data in CONSTANT_CASE.
   */
  get constantcased(): Data {
    return this.changeCase(constantcaseText);
  }

  /**
   * Returns the data in Title Case.
   */
  get titlecased(): Data {
    return this.changeCase(titlecaseText);
  }

  /**
   * Returns the data in PascalCase.
   */
  get pascalcased(): Data {
    return this.changeCase(pascalcaseText);
  }

  /**
   * Returns the data in kebab-case.
   */
  get kebabcased(): Data {
    return this.changeCase(kebabcaseText);
  }

  /**
   * Merges all sub-objects of the array into one object.
   */
  get merged(): Data {
    return Data.create(Object.assign({}, ...this.values.value));
  }

  /**
   * Logs the data to the console.
   */
  get logged(): this {
    log(String(this.json));

    return this;
  }

  /**
   * Returns true if the value is empty.
   */
  get empty(): boolean {
    return isEmpty(this.value);
  }

  /**
   * Returns true if the value is not empty.
   */
  get notEmpty(): boolean {
    return isNotEmpty(this.value);
  }

  /**
   * Returns all objects in the data (deeply traversed).
   */
  get objects(): Data<any[]> {
    const result: any[] = [];

    this.traverse((obj) => result.push(obj));

    return data(result);
  }

  /**
   * Executes a function to map each item of the data.
   */
  get each(): {
    [key in keyof ItemType]: (
      ...args: Parameters<
        ItemType[key] extends (...args: any) => any ? ItemType[key] : never
      >
    ) => Data<ValueType>;
  } {
    return new Proxy(
      {},
      {
        has: (_: any, key: string): boolean => {
          const firstItem = this.first?.value as any;

          return firstItem ? key in firstItem : false;
        },
        ownKeys: (_: any): (string | symbol)[] => {
          const firstItem = this.first?.value as any;

          return firstItem ? Reflect.ownKeys(firstItem) : [];
        },
        get: (target: any, key: string): any => {
          return new Proxy(() => {}, {
            apply: (_: any, thisArg: any, args: any[]): any => {
              return this.map((item) => (item as any)[key](...args));
            },
          });
        },
      },
    );
  }

  /**
   * Returns the data with all $ref references resolved.
   */
  get dereferenced(): Data {
    return Data.create(
      dereferenceJsonSchema(cloneObjectDeep(this.value as any)),
    );
  }

  /**
   * Returns the keys.
   */
  get keys(): Data<KeyType[]> {
    if (Array.isArray(this.value)) {
      return Data.create(
        (this.value as any).map((_: any, index: any) => index),
      ) as any;
    }

    return Data.create(Object.keys(this.value as any)) as any;
  }

  /**
   * Returns the values.
   */
  get values(): Data<ItemType[]> {
    if (Array.isArray(this.value)) {
      return Data.create(this.value) as any;
    }

    return Data.create(Object.values(this.value as any)) as any;
  }

  /**
   * Returns the length of the data.
   */
  get length(): number {
    if (Array.isArray(this.value)) {
      return this.value.length;
    }

    return Object.keys(this.value as any).length;
  }

  /**
   * Returns all entries.
   */
  get entries(): Data<[KeyType, ItemType][]> {
    if (Array.isArray(this.value)) {
      return Data.create([...this.value.entries()]) as any;
    }

    return Data.create(Object.entries(this.value as any)) as any;
  }

  /**
   * Converts an array of entries into an object.
   */
  get unentries(): Data<
    ValueType extends number[][] | [number, number][]
      ? any[]
      : Record<string, any>
  > {
    if (Array.isArray(this.value)) {
      const toArray = typeof this.value[0]?.[0] === 'number';
      if (toArray) {
        const result: any[] = [];
        this.value.forEach(([index, item]) => {
          result[index] = item;
        });

        return Data.create(result) as any;
      }

      return Data.create(Object.fromEntries(this.value)) as any;
    }

    throw new Error('Not an array.');
  }

  /**
   * Returns the data at the given path, index or jsonata expression.
   */
  get(path: string | number | jsonata.Expression): Data | Text | null {
    let result: any;
    if (typeof path === 'string') {
      const jsonata = require('jsonata') as typeof import('jsonata');

      const expression = jsonata(path);

      result = expression.evaluate(this.value);
    } else if (path && typeof path === 'object') {
      result = path.evaluate(this.value);
    } else {
      if (this.value && typeof this.value === 'object' && 'at' in this.value) {
        result = (this.value as any).at(path) || null;
      } else {
        result = (this.value as any)[path] || null;
      }
    }

    if (result === null || result === undefined) {
      return null;
    }

    if (typeof result === 'string' || result instanceof Text) {
      return Text.create(result);
    }

    return Data.create(result);
  }

  /**
   * Sets the value at the given path or index.
   */
  set(path: string | number, value: any): this {
    if (value instanceof Data) {
      value = value.value;
    }

    if (typeof path === 'string' && path.includes('.')) {
      throw new Error('Does not support nested path expressions.');
    }

    (this.value as any)[path] = value;

    return this;
  }

  /**
   * Returns the data with the casing changed.
   */
  changeCase(cb: (text: string) => string): Data {
    if (Array.isArray(this.value)) {
      return Data.create(
        this.value.map((item) =>
          typeof item === 'string' ? cb(item) : mapObjectKeys(item, cb),
        ),
      );
    }

    return Data.create(mapObjectKeys(this.value, cb));
  }

  /**
   * Groups the data using the given key callback.
   */
  group<KeyType extends string | number | symbol, GroupType = ItemType[]>(
    keyFn: (item: ItemType) => KeyType,
    reduceFn: (group: GroupType, item: ItemType, key: KeyType) => GroupType = (
      group,
      item,
    ) => [...(group as any), item] as any,
    groupFn: (key: KeyType) => GroupType = () => [] as any,
  ): Data<Record<KeyType, GroupType>> {
    const values = this.values;

    return values.reduce((result, item) => {
      const key = keyFn(item);
      let group = result[key];
      if (!group) {
        group = groupFn(key);
      }

      result[key] = reduceFn(group, item, key);

      return result;
    }, {} as Record<KeyType, GroupType>);
  }

  /**
   * Groups and counts the data using the given key callback.
   */
  groupCount<KeyType extends string | number | symbol>(
    keyFn: (item: ItemType) => KeyType,
  ): Data<Record<KeyType, number>> {
    return this.group(
      keyFn,
      (r) => r + 1,
      () => 0,
    );
  }

  equals(value: any): boolean {
    return equalsObjectDeep(this.value, value);
  }

  /**
   * Returns the data sorted.
   */
  sort(
    compareFn?: (a: ItemType, b: ItemType) => number,
  ): Data<ValueType extends Array<any> ? ValueType : any> {
    if (Array.isArray(this.value)) {
      return Data.create([...this.value].sort(compareFn)) as any;
    }

    const entries = this.entries.value;
    entries.sort(([, a], [, b]) => {
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

    return Data.create(Object.fromEntries(entries)) as any;
  }

  /**
   * Returns the data sorted keys.
   */
  sortKeys(
    compareFn: ((a: KeyType, b: KeyType) => number) | null = null,
  ): Data<ValueType extends Array<any> ? ValueType : any> {
    if (Array.isArray(this.value)) {
      throw new Error('Cannot sort keys of an array.');
    }

    const entries = this.entries.value;
    entries.sort(([aIndex], [bIndex]) => {
      if (compareFn) {
        return compareFn(aIndex, bIndex);
      }

      if (aIndex < bIndex) {
        return -1;
      }

      if (aIndex > bIndex) {
        return 1;
      }

      return 0;
    });

    return Data.create(Object.fromEntries(entries)) as any;
  }

  /**
   * Returns the data filtered by the given callback.
   */
  filter(
    cb: (value: ItemType, key: KeyType) => boolean,
  ): Data<AnyPartial<ValueType>> {
    if (Array.isArray(this.value)) {
      return Data.create(this.value.filter(cb as any) as any) as any;
    }

    const newValue: any = {};
    this.keys.forEach((key: any) => {
      const value = (this.value as any)[key];
      if (cb(value, key)) {
        newValue[key] = value;
      }
    });

    return Data.create(newValue) as any;
  }

  /**
   * Returns the value matching the given callback.
   */
  find(cb: (value: ItemType, key: KeyType) => boolean): Data<ItemType> | null {
    if (Array.isArray(this.value)) {
      const result = this.value.find(cb as any) as any;

      return result ? (Data.create(result) as any) : null;
    }

    let result: any = null;
    for (const key of this.keys.value) {
      const value = (this.value as any)[key];
      if (cb(value, key)) {
        result = value;

        break;
      }
    }

    return result ? (Data.create(result) as any) : null;
  }

  /**
   * Returns the index of the item matching the given callback.
   */
  findKey(cb: (value: ItemType, key: KeyType) => boolean): KeyType | null {
    if (Array.isArray(this.value)) {
      const result = this.value.findIndex(cb as any) as any;

      return result >= 0 ? result : null;
    }

    let result: any = null;
    for (const key of this.keys.value) {
      const value = (this.value as any)[key];
      if (cb(value, key)) {
        result = key;

        break;
      }
    }

    return result;
  }

  /**
   * Traverses the data deeply.
   */
  traverse(cb: (obj: Record<string | number | symbol, any>) => void): this {
    traverseObjectDeep(this.value, cb);

    return this;
  }

  chunk(
    size: number,
  ): ValueType extends Array<any> ? Data<ValueType> : Data<any[]> {
    if (Array.isArray(this.value)) {
      return Data.create(chunkArray(this.value, size)) as any;
    }

    return Data.create(
      chunkArray(Object.entries(this.value as any), size).map((entries) =>
        Object.fromEntries(entries),
      ),
    ) as any;
  }

  /**
   * Returns the diff of the two objects or arrays.
   */
  diff(other: Data | Record<string, any> | any[]): Data {
    const otherValue = unwrap(other);
    const value = this.value;
    const isArray = Array.isArray(value);
    const isOtherArray = Array.isArray(otherValue);
    if (isArray !== isOtherArray) {
      throw new Error('Can only diff if both are arrays or both are objects.');
    }

    if (isArray && isOtherArray) {
      return Data.create(diffArray(value, otherValue));
    }

    const diff = diffObjectKeys(value as any, otherValue);

    return Data.create(diff);
  }

  /**
   * Returns the intersection of the two objects or arrays.
   */
  intersect(other: Data | Record<string, any> | any[]): Data {
    const otherValue = unwrap(other);
    const value = this.value;
    const isArray = Array.isArray(value);
    const isOtherArray = Array.isArray(otherValue);
    if (isArray !== isOtherArray) {
      throw new Error(
        'Can only intersect if both are arrays or both are objects.',
      );
    }

    if (isArray && isOtherArray) {
      return Data.create(intersectArray(value, otherValue));
    }

    const intersection = intersectObjectKeys(value as any, otherValue);

    return Data.create(intersection);
  }

  /**
   * Returns the union of the two objects or arrays.
   */
  union(other: Data | Record<string, any> | any[]): Data {
    const otherValue = unwrap(other);
    const value = this.value;
    const isArray = Array.isArray(value);
    const isOtherArray = Array.isArray(otherValue);
    if (isArray !== isOtherArray) {
      throw new Error('Can only diff if both are arrays or both are objects.');
    }

    if (isArray && isOtherArray) {
      return Data.create(unionArray(value, otherValue));
    }

    const union = unionObjectKeys(value as any, otherValue);

    return Data.create(union);
  }

  /**
   * Returns true if at least one item matches the given callback.
   */
  some(cb: (value: ItemType, key: KeyType) => boolean): boolean {
    if (Array.isArray(this.value)) {
      return this.value.some(cb as any);
    }

    let result = false;
    for (const key of this.keys.value) {
      const value = (this.value as any)[key];
      if (cb(value, key)) {
        result = true;

        break;
      }
    }

    return result;
  }

  /**
   * Returns true if all items match the given callback.
   */
  every(cb: (value: ItemType, key: KeyType) => boolean): boolean {
    if (Array.isArray(this.value)) {
      return this.value.every(cb as any);
    }

    let result = true;
    for (const key of this.keys.value) {
      const value = (this.value as any)[key];
      if (!cb(value, key)) {
        result = false;

        break;
      }
    }

    return result;
  }

  pipe<ResultType>(
    operation: (value: ValueType) => ResultType,
  ): Data<ResultType> {
    return Data.create(operation(this.value)) as any;
  }

  forEach(cb: (value: ItemType, key: KeyType) => any): void {
    if (Array.isArray(this.value)) {
      return this.value.forEach(cb as any);
    }

    this.keys.forEach((key: any) => {
      const value = (this.value as any)[key];
      cb(value, key);
    });
  }

  reduce<ResultType>(
    cb: (result: ResultType, item: ItemType, key: KeyType) => ResultType,
    initial: ResultType,
  ): Data<ResultType> {
    if (Array.isArray(this.value)) {
      return Data.create(
        this.value.reduce(
          (result, value, key) => cb(result, value, key as any),
          initial,
        ),
      ) as any;
    }

    return Data.create(
      this.entries.value.reduce(
        (result, [key, value]) => cb(result, value, key),
        initial,
      ),
    ) as any;
  }

  /**
   * Maps all items of the data.
   */
  map<MappedItemType = any>(
    cb: (value: ItemType, key: KeyType) => MappedItemType,
  ): Data<
    ValueType extends Array<any>
      ? MappedItemType[]
      : ValueType extends Record<string, any>
      ? { [key: string]: MappedItemType }
      : any
  > {
    if (Array.isArray(this.value)) {
      return Data.create((this.value as any).map(cb as any) as any) as any;
    }

    const newValue: any = {};
    this.keys.forEach((key: any) => {
      const value = (this.value as any)[key];
      newValue[key] = cb(value, key);
    });

    return Data.create(newValue) as any;
  }

  /**
   * Maps all keys of the data.
   */
  mapKeys(cb: (key: KeyType, item: ItemType) => KeyType): this {
    if (Array.isArray(this.value)) {
      throw new Error('Cannot map keys of an array.');
    }

    const newValue: any = {};
    this.keys.forEach((key: any) => {
      const value = (this.value as any)[key];
      newValue[cb(key, value)] = value;
    });

    return Data.create(newValue) as any;
  }

  /**
   * Joins the data using the given separator.
   */
  join(separator: string): Text {
    if (Array.isArray(this.value)) {
      return Text.create(this.value.join(separator));
    }

    return Text.create(Object.values(this.value as any).join(separator));
  }

  /**
   * Slices the given range of the array.
   */
  slice(
    start?: number,
    end?: number,
  ): Data<ValueType extends Array<any> ? ValueType : any> {
    if (Array.isArray(this.value)) {
      return Data.create(this.value.slice(start, end)) as any;
    }

    return Data.create(
      Object.fromEntries(Object.entries(this.value as any).slice(start, end)),
    ) as any;
  }

  valueOf(): ValueType {
    return this.value;
  }

  [inspect.custom](): string {
    return `Data ${inspect(this.value)}`;
  }

  static create<ValueType = any>(value: ValueType): Data<ValueType> {
    if (value instanceof Data) {
      return value as any;
    }

    return new Data(value);
  }
}
