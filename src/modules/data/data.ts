import jsonata, { Expression } from 'jsonata';
import { transform, wrapString } from './transformer';
import { Wrapper } from './wrapper';
import { Text } from './text';
import { DataSource } from './data-source';
import { inspect } from 'util';
import { DataTransformation } from './data-transformation';
import type {
  AnyItemType,
  AnyKeyType,
  AnyPartial,
} from '../../interfaces/util';
import { mapObjectKeys } from '../utils/object';
import { DataType } from './data-type';
import {
  camelcaseText,
  constantcaseText,
  kebabcaseText,
  pascalcaseText,
  snakecaseText,
  titlecaseText,
} from '../utils/text';

/**
 * Generic wrapper for runtime objects
 */
export class Data<
  ValueType = any,
  ItemType = AnyItemType<ValueType>,
  KeyType = AnyKeyType<ValueType>,
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

  get clone(): Data<ValueType> {
    return new Data<ValueType>(JSON.parse(JSON.stringify(this.value)), this);
  }

  get flattened(): Data<
    ValueType extends Array<any> ? FlatArray<ValueType, 1> : ValueType
  > {
    if (Array.isArray(this.value)) {
      return new Data(this.value.flat() as any, this) as any;
    }

    return this as any;
  }

  get first(): Data<ItemType> | null {
    if (Array.isArray(this.value)) {
      return this.value.length ? new Data<ItemType>(this.value[0], this) : null;
    }

    const values = Object.values(this.value);

    return values.length ? new Data<ItemType>(values[0], this) : null;
  }

  get last(): Data<ItemType> | null {
    if (Array.isArray(this.value)) {
      return this.value.length
        ? new Data<ItemType>(this.value[this.value.length - 1], this)
        : null;
    }

    const values = Object.values(this.value);

    return values.length
      ? new Data<ItemType>(values[values.length - 1], this)
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

    return new Data(values.sum.value / values.length);
  }

  get unique(): Data<AnyPartial<ValueType>> {
    if (Array.isArray(this.value)) {
      return new Data(this.value.unique, this) as any;
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

  get reversed(): Data<ValueType extends Array<any> ? ValueType : any> {
    if (Array.isArray(this.value)) {
      return new Data(this.value.reverse(), this) as any;
    }

    return new Data(
      Object.fromEntries(Object.entries(this.value).reverse()),
      this,
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

  get keys(): Data<KeyType[]> {
    if (Array.isArray(this.value)) {
      return new Data(
        (this.value as any).map((_: any, index: any) => index),
      ) as any;
    }

    return new Data(Object.keys(this.value)) as any;
  }

  get values(): Data<ItemType[]> {
    if (Array.isArray(this.value)) {
      return new Data(this.value) as any;
    }

    return new Data(Object.values(this.value));
  }

  get length(): number {
    return (this.value as any).length;
  }

  get entries(): Data<[KeyType, ItemType][]> {
    if (Array.isArray(this.value)) {
      return new Data(this.value.entries()) as any;
    }

    return new Data(Object.entries(this.value)) as any;
  }

  changeCase(cb: (text: string) => string): Data {
    if (Array.isArray(this.value)) {
      return new Data(
        this.value.map((item) =>
          typeof item === 'string' ? cb(item) : mapObjectKeys(item, cb),
        ),
      );
    }

    return new Data(mapObjectKeys(this.value, cb), this);
  }

  setSource(source: DataSource | null): Data<ValueType> {
    this.source = source;

    return this as any;
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
  ) {
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
      return new Data([...this.value].sort(compareFn), this) as any;
    }

    const entries = this.entries.value;
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

    return new Data(Object.fromEntries(entries), this) as any;
  }

  filter(
    cb: (value: ItemType, key: KeyType) => boolean,
  ): Data<AnyPartial<ValueType>> {
    if (Array.isArray(this.value)) {
      return new Data(this.value.filter(cb as any) as any, this) as any;
    }

    const newValue: any = {};
    this.keys.forEach((key: any) => {
      const value = (this.value as any)[key];
      if (cb(value, key)) {
        newValue[key] = value;
      }
    });

    return new Data(newValue, this) as any;
  }

  find(
    cb: (value: ItemType, key: KeyType) => boolean,
  ): Data<ItemType> | undefined {
    if (Array.isArray(this.value)) {
      const result = this.value.find(cb as any) as any;

      return result ? (new Data(result, this) as any) : undefined;
    }

    let result: any = null;
    for (const key of this.keys.value) {
      const value = (this.value as any)[key];
      if (cb(value, key)) {
        result = value;

        break;
      }
    }

    return result ? (new Data(result, this) as any) : undefined;
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
    return new Data(operation(this.value), this);
  }

  forEach(cb: (value: ItemType, key: KeyType) => any) {
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
      return new Data<ResultType>(
        this.value.reduce(
          (result, value, key) => cb(result, value, key as any),
          initial,
        ),
        this,
      );
    }

    return new Data(
      this.entries.value.reduce(
        (result, [key, value]) => cb(result, value, key),
        initial,
      ),
      this,
    );
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
      return new Data((this.value as any).map(cb as any) as any, this) as any;
    }

    const newValue: any = {};
    this.keys.forEach((key: any) => {
      const value = (this.value as any)[key];
      newValue[key] = cb(value, key);
    });

    return new Data(newValue, this) as any;
  }

  mapKeys(cb: (key: KeyType, item: ItemType) => KeyType): this {
    if (Array.isArray(this.value)) {
      return new Data(
        (this.value as any).reduce(
          (result: any, item: ItemType, key: KeyType) => {
            result[cb(key, item)] = item;
            return result;
          },
          [] as any,
        ) as any,
        this,
      ) as any;
    }

    const newValue: any = {};
    this.keys.forEach((key: any) => {
      const value = (this.value as any)[key];
      newValue[cb(key, value)] = value;
    });

    return new Data(newValue, this) as any;
  }

  join(separator: string): Text {
    if (Array.isArray(this.value)) {
      return wrapString(this.value.join(separator), null, this);
    }

    return wrapString(Object.values(this.value).join(separator), null, this);
  }

  extract<ExtractedValueType = any>(
    exp: string | Expression,
  ): Data<ExtractedValueType> {
    if (typeof exp === 'string') {
      exp = jsonata(exp);
    }

    return new Data(exp.evaluate(this.value), this) as any;
  }

  transformTo<TargetType = any>(targetType: DataType | string): TargetType {
    if (typeof targetType === 'string') {
      targetType = DataType.fromString(targetType);
    }

    return transform(this, new DataTransformation(DataType.Data, targetType));
  }

  [inspect.custom]() {
    return `Data ${inspect(this.value)}`;
  }
}
