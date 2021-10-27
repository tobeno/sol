import jsonata, { Expression } from 'jsonata';
import { transform, wrapObject, wrapString } from './transformer';
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
import { camelcaseObject, snakecaseObject } from '../utils/object';
import { DataType } from './data-type';

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

  get first(): Data<ItemType> | null {
    if (Array.isArray(this.value)) {
      return this.value.length
        ? wrapObject<ItemType>(this.value[0], this)
        : null;
    }

    const values = Object.values(this.value);

    return values.length ? wrapObject<ItemType>(values[0], this) : null;
  }

  get last(): Data<ItemType> | null {
    if (Array.isArray(this.value)) {
      return this.value.length
        ? wrapObject<ItemType>(this.value[this.value.length - 1], this)
        : null;
    }

    const values = Object.values(this.value);

    return values.length
      ? wrapObject<ItemType>(values[values.length - 1], this)
      : null;
  }

  get unique(): Data<AnyPartial<ValueType>> {
    if (Array.isArray(this.value)) {
      return wrapObject(this.value.unique, this) as any;
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
      return wrapObject(this.value.reverse(), this) as any;
    }

    return wrapObject(
      Object.fromEntries(Object.entries(this.value).reverse()),
      this,
    ) as any;
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

  setSource(source: DataSource | null): Data<ValueType> {
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

  find(
    cb: (value: ItemType, index: KeyType) => boolean,
  ): Data<ItemType> | undefined {
    if (Array.isArray(this.value)) {
      const result = this.value.find(cb as any) as any;

      return result ? (wrapObject(result, this) as any) : undefined;
    }

    let result: any = null;
    for (const index of this.keys) {
      const value = (this.value as any)[index];
      if (cb(value, index)) {
        result = value;

        break;
      }
    }

    return result ? (wrapObject(result, this) as any) : undefined;
  }

  findIndex(cb: (value: ItemType, index: KeyType) => boolean): KeyType {
    if (Array.isArray(this.value)) {
      return this.value.findIndex(cb as any) as any;
    }

    let result: any = null;
    for (const index of this.keys) {
      const value = (this.value as any)[index];
      if (cb(value, index)) {
        result = index;

        break;
      }
    }

    return result;
  }

  reduce<ResultType>(
    cb: (result: ResultType, item: ItemType, index: KeyType) => ResultType,
    initial: ResultType,
  ): Data<ResultType> {
    if (Array.isArray(this.value)) {
      return wrapObject<ResultType>(
        this.value.reduce(
          (result, value, index) => cb(result, value, index as any),
          initial,
        ),
        this,
      );
    }

    return wrapObject(
      this.entries.reduce(
        (result, [key, value]) => cb(result, value, key),
        initial,
      ),
      this,
    );
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

  extract<ExtractedValueType = any>(
    exp: string | Expression,
  ): Data<ExtractedValueType> {
    if (typeof exp === 'string') {
      exp = jsonata(exp);
    }

    return wrapObject(exp.evaluate(this.value), this) as any;
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
