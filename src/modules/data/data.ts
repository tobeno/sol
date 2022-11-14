import jsonata, { Expression } from 'jsonata';
import { Wrapper } from './wrapper';
import { Text } from './text';
import { inspect } from 'util';
import type {
  AnyItemType,
  AnyKeyType,
  AnyPartial,
} from '../../interfaces/util';
import {
  cloneObjectDeep,
  flattenObject,
  mapObjectKeys,
  traverseObject,
} from '../../utils/object';
import {
  camelcaseText,
  constantcaseText,
  kebabcaseText,
  pascalcaseText,
  snakecaseText,
  titlecaseText,
} from '../../utils/text';
import { log } from '../../utils/log';
import { uniqueArray } from '../../utils/array';
import { dereferenceJsonSchema } from '../../utils/json-schema';

/**
 * Generic wrapper for runtime objects
 */
export class Data<
  ValueType = any,
  ItemType = AnyItemType<ValueType>,
  KeyType = AnyKeyType<ValueType>,
> extends Wrapper<ValueType> {
  constructor(value: ValueType) {
    super(value);
  }

  get clone(): Data<ValueType> {
    return Data.create(JSON.parse(JSON.stringify(this.value))) as any;
  }

  get flattened(): Data<
    ValueType extends Array<any> ? FlatArray<ValueType, 1> : ValueType
  > {
    if (Array.isArray(this.value)) {
      return Data.create(this.value.flat() as any) as any;
    }

    return Data.create(flattenObject(this.value)) as any;
  }

  get first(): Data<ItemType> | null {
    if (Array.isArray(this.value)) {
      return this.value.length ? (Data.create(this.value[0]) as any) : null;
    }

    const values = Object.values(this.value as any);

    return values.length ? (Data.create(values[0]) as any) : null;
  }

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

  get sum(): Data<number> {
    const values = this.values;

    return values.reduce(
      (result, value) => result + (parseFloat(value as any) || 0),
      0,
    );
  }

  get avg(): Data<number> {
    const values = this.values;

    return Data.create(values.sum.value / values.length) as any;
  }

  get unique(): Data<AnyPartial<ValueType>> {
    if (Array.isArray(this.value)) {
      return Data.create(uniqueArray(this.value)) as any;
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

  get sortedKeys(): Data<ValueType extends Array<any> ? ValueType : any> {
    return this.sortKeys();
  }

  get reversed(): Data<ValueType extends Array<any> ? ValueType : any> {
    if (Array.isArray(this.value)) {
      return Data.create(this.value.reverse()) as any;
    }

    return Data.create(
      Object.fromEntries(Object.entries(this.value as any).reverse()),
    ) as any;
  }

  get filtered(): Data<AnyPartial<ValueType>> {
    return this.filter((value: any) => !!value);
  }

  get camelcased(): Data {
    return this.changeCase(camelcaseText);
  }

  get snakecased(): Data {
    return this.changeCase(snakecaseText);
  }

  get constantcased(): Data {
    return this.changeCase(constantcaseText);
  }

  get titlecased(): Data {
    return this.changeCase(titlecaseText);
  }

  get pascalcased(): Data {
    return this.changeCase(pascalcaseText);
  }

  get kebabcased(): Data {
    return this.changeCase(kebabcaseText);
  }

  get logged(): this {
    log(String(this.json));

    return this;
  }

  get each(): {
    [key in keyof ItemType]: (
      ...args: Parameters<
        ItemType[key] extends (...args: any) => any ? ItemType[key] : never
      >
    ) => Data<ValueType>;
  } {
    const items = this.value;
    if (!Array.isArray(items)) {
      throw new Error('Not an array.');
    }

    return new Proxy(
      {},
      {
        has: (_: any, key: string): boolean => {
          return items.length > 0 ? key in items[0] : false;
        },
        ownKeys: (_: any): (string | symbol)[] => {
          return items.length > 0 ? Reflect.ownKeys(items[0]) : [];
        },
        get: (target: any, key: string): any => {
          return new Proxy(() => {}, {
            apply: (_: any, thisArg: any, args: any[]): any => {
              return data(items.map((item) => item[key].apply(item, args)));
            },
          });
        },
      },
    );
  }

  get dereferenced(): Data {
    return Data.create(
      dereferenceJsonSchema(cloneObjectDeep(this.value as any)),
    );
  }

  get keys(): Data<KeyType[]> {
    if (Array.isArray(this.value)) {
      return Data.create(
        (this.value as any).map((_: any, index: any) => index),
      ) as any;
    }

    return Data.create(Object.keys(this.value as any)) as any;
  }

  get values(): Data<ItemType[]> {
    if (Array.isArray(this.value)) {
      return Data.create(this.value) as any;
    }

    return Data.create(Object.values(this.value as any)) as any;
  }

  get length(): number {
    return (this.value as any).length;
  }

  get entries(): Data<[KeyType, ItemType][]> {
    if (Array.isArray(this.value)) {
      return Data.create(this.value.entries()) as any;
    }

    return Data.create(Object.entries(this.value as any)) as any;
  }

  get unentries(): Data<Record<string, any>> {
    if (Array.isArray(this.value)) {
      return Data.create(Object.fromEntries(this.value)) as any;
    }

    throw new Error('Not an array.');
  }

  get(path: string | number | Expression): Data | Text | null {
    let result: any;
    if (typeof path === 'string') {
      const expression = jsonata(path);
      result = expression.evaluate(this.value);
    } else if (path && typeof path === 'object') {
      result = path.evaluate(this.value);
    } else {
      result = (this.value as any)[path] || null;
    }

    if (result === null || result === undefined) {
      return null;
    }

    if (typeof result === 'string' || result instanceof Text) {
      return Text.create(result);
    }

    return Data.create(result);
  }

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

  groupCount<KeyType extends string | number | symbol>(
    keyFn: (item: ItemType) => KeyType,
  ): Data<Record<KeyType, number>> {
    return this.group(
      keyFn,
      (r) => r + 1,
      () => 0,
    );
  }

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

  sortKeys(
    compareFn?: (a: KeyType, b: KeyType) => number,
  ): Data<ValueType extends Array<any> ? ValueType : any> {
    if (Array.isArray(this.value)) {
      return Data.create([...this.value].sort(compareFn)) as any;
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

  find(
    cb: (value: ItemType, key: KeyType) => boolean,
  ): Data<ItemType> | undefined {
    if (Array.isArray(this.value)) {
      const result = this.value.find(cb as any) as any;

      return result ? (Data.create(result) as any) : undefined;
    }

    let result: any = null;
    for (const key of this.keys.value) {
      const value = (this.value as any)[key];
      if (cb(value, key)) {
        result = value;

        break;
      }
    }

    return result ? (Data.create(result) as any) : undefined;
  }

  findIndex(cb: (value: ItemType, key: KeyType) => boolean): KeyType {
    if (Array.isArray(this.value)) {
      return this.value.findIndex(cb as any) as any;
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

  traverse(cb: (obj: Record<string | number | symbol, any>) => void): this {
    traverseObject(this.value, cb);

    return this;
  }

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

  mapKeys(cb: (key: KeyType, item: ItemType) => KeyType): this {
    if (Array.isArray(this.value)) {
      return Data.create(
        (this.value as any).reduce(
          (result: any, item: ItemType, key: KeyType) => {
            result[cb(key, item)] = item;
            return result;
          },
          [] as any,
        ) as any,
      ) as any;
    }

    const newValue: any = {};
    this.keys.forEach((key: any) => {
      const value = (this.value as any)[key];
      newValue[cb(key, value)] = value;
    });

    return Data.create(newValue) as any;
  }

  join(separator: string): Text {
    if (Array.isArray(this.value)) {
      return Text.create(this.value.join(separator));
    }

    return Text.create(Object.values(this.value as any).join(separator));
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
