import { RecordItemType } from '../interfaces/util';
import { camelcaseText, snakecaseText } from './text';

export function sortObjectKeys<T extends Record<string, any>>(obj: T): T {
  return Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    Object.keys(obj)
      .sort()
      .reduce((result, key) => {
        result[key] = obj[key];

        return result;
      }, {} as any),
  );
}

export function rsortObjectKeys<T extends Record<string, any>>(obj: T): T {
  return Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    Object.keys(obj)
      .sort()
      .reverse()
      .reduce((result, key) => {
        result[key] = obj[key];

        return result;
      }, {} as any),
  );
}

export function sortObject<T extends Record<string, any>>(obj: T): T {
  return Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    Object.keys(obj)
      .sort((key1, key2) => {
        const value1 = obj[key1];
        const value2 = obj[key2];

        if (value1 < value2) {
          return 1;
        }

        if (value1 > value2) {
          return -1;
        }

        return 0;
      })
      .reduce((result: any, key: string) => {
        result[key] = obj[key];

        return result;
      }, {} as any),
  );
}

export function rsortObject<T extends Record<string, any>>(obj: T): T {
  return Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    Object.keys(obj)
      .sort((key1, key2) => {
        const value1 = obj[key1];
        const value2 = obj[key2];

        if (value1 < value2) {
          return -1;
        }

        if (value1 > value2) {
          return 1;
        }

        return 0;
      })
      .reduce((result: any, key: string) => {
        result[key] = obj[key];

        return result;
      }, {} as any),
  );
}

export function intersectObjectKeys<
  T extends Record<string, any>,
  T2 extends Record<string, any>
>(obj: T, obj2: T2): Omit<T, keyof Omit<T, keyof T2>> {
  const result: any = {};

  const keys2 = Object.keys(obj2);

  Object.keys(obj).forEach((key) => {
    if (keys2.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

export function diffObjectKeys<
  T extends Record<string, any>,
  T2 extends Record<string, any>
>(obj: T, obj2: T2): Omit<T, keyof T2> {
  const result: any = {};

  const keys2 = Object.keys(obj2);

  Object.keys(obj).forEach((key) => {
    if (!keys2.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

export function unionObjectKeys<
  T extends Record<string, any>,
  T2 extends Record<string, any>
>(obj: T, obj2: T2): T & T2 {
  const result: any = {};

  Object.keys(obj2).forEach((key) => {
    result[key] = obj2[key];
  });
  Object.keys(obj).forEach((key) => {
    result[key] = obj[key];
  });

  return result;
}

export function filterObject<T extends Record<string, any>>(
  obj: T,
  cb: (value: RecordItemType<T>, key: string) => boolean = (
    value: RecordItemType<T>,
  ) => !!value,
): Partial<T> {
  const result: any = {};

  Object.keys(obj).forEach((key) => {
    if (cb(obj[key], key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

export function rfilterObject<T extends Record<string, any>>(
  obj: T,
  cb: (value: RecordItemType<T>, key: string) => boolean,
): Partial<T> {
  return filterObject(obj, (value: any, key: string) => !cb(value, key));
}

export function mapObject<T extends Record<string, any>>(
  obj: T,
  cb: (value: any, key: string) => boolean,
): T {
  const result: any = {};

  Object.keys(obj).forEach((key) => {
    result[key] = cb(obj[key], key);
  });

  return result;
}

export function grepObjectKeys<T extends Record<string, any>>(
  obj: T,
  search: string | RegExp,
): Partial<T> {
  return filterObject(obj, (_: any, key: string) => {
    if (search instanceof RegExp) {
      return search.test(key);
    }

    return key.includes(search);
  });
}

export function rgrepObjectKeys<T extends Record<string, any>>(
  obj: T,
  search: string | RegExp,
): Partial<T> {
  return filterObject(obj, (_: any, key: string) => {
    if (search instanceof RegExp) {
      return !search.test(key);
    }

    return !key.includes(search);
  });
}

export function grepObject<T extends Record<string, any>>(
  obj: T,
  search: string | RegExp,
): Partial<T> {
  return filterObject(obj, (value: any) => {
    value = '' + value;

    if (search instanceof RegExp) {
      return search.test(value);
    }

    return value.includes(search);
  });
}

export function rgrepObject<T extends Record<string, any>>(
  obj: T,
  search: string | RegExp,
): Partial<T> {
  return filterObject(obj, (value: any) => {
    value = '' + value;

    if (search instanceof RegExp) {
      return !search.test(value);
    }

    return !value.includes(search);
  });
}

export function cloneObject<T extends Record<string, any>>(obj: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}

export function camelcaseObject(
  obj: any,
  {
    capitalize = false,
    includeConstantCase = false,
  }: { capitalize?: boolean | null; includeConstantCase?: boolean | null } = {},
): any {
  if (!obj || typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => camelcaseObject(item));
  }

  return Object.keys(obj).reduce((result, key) => {
    const value = obj[key];

    result[
      camelcaseText(key, {
        capitalize,
        includeConstantCase,
      })
    ] = camelcaseObject(value);

    return result;
  }, {} as any);
}

export function snakecaseObject(obj: any): any {
  if (!obj || typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => snakecaseObject(item));
  }

  return Object.keys(obj).reduce((result, key) => {
    const value = obj[key];

    result[snakecaseText(key)] = snakecaseObject(value);

    return result;
  }, {} as any);
}

export function isObjectPropertyDescriptor(
  obj: any | (PropertyDescriptor & ThisType<any>),
): any {
  return (
    typeof obj !== 'function' &&
    Object.keys(obj).every((key) => ['get', 'set'].includes(key))
  );
}

export function registerObjectProperties(
  obj: any,
  properties: Record<string, any> | (PropertyDescriptorMap & ThisType<any>),
): any {
  Object.keys(properties).forEach(function (propertyName) {
    const propertyValue = properties[propertyName];
    const isDescriptor = isObjectPropertyDescriptor(propertyValue);

    Object.defineProperty(obj, propertyName, {
      ...(isDescriptor ? propertyValue : { value: propertyValue }),
      enumerable: false,
      configurable: true,
    });
  });

  return obj;
}
