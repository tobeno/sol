import fastDeepEqual from 'fast-deep-equal/es6';
import { DeepPartial } from '../interfaces/helper.interfaces';
import { isObject } from './core.utils';
import { unwrapDeep } from './wrapper.utils';

export function intersectObjectKeys<
  T extends Record<string, any>,
  T2 extends Record<string, any>,
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
  T2 extends Record<string, any>,
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
  T2 extends Record<string, any>,
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

/**
 * Traverses an object deeply using the given callback
 *
 * The callback will be triggered for all objects found in obj.
 */
export function traverseObjectDeep(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  obj: any,
  callback: (value: any, key: string | null) => void,
  path: string | null = null,
): void {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) =>
        traverseObjectDeep(item, callback, `${path || ''}[${index}]`),
      );
    } else if (!(obj instanceof Date)) {
      Object.keys(obj).forEach((key) => {
        const isStringKey = !!key.match(/[^a-zA-Z0-9_]/);

        traverseObjectDeep(
          obj[key],
          callback,
          `${path || ''}${
            isStringKey ? `['${key}']` : `${path ? '.' : ''}${key}`
          }`,
        );
      });

      callback(obj, path);
    }
  }
}

export function cloneObjectDeep<T extends Record<string, any>>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function mapObjectKeys(obj: any, cb: (key: string) => string): any {
  if (!obj || typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => mapObjectKeys(item, cb));
  }

  return Object.keys(obj).reduce((result, key) => {
    const value = obj[key];

    result[cb(key)] = mapObjectKeys(value, cb);

    return result;
  }, {} as any);
}

export function isNativeObject(obj: any): boolean {
  return obj instanceof Date || obj instanceof Error || obj instanceof RegExp;
}

export function flattenObject(obj: any, prefix: string = ''): any {
  if (
    obj &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    !isNativeObject(obj)
  ) {
    return Object.keys(obj).reduce((result, key) => {
      const value = obj[key];

      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !isNativeObject(value)
      ) {
        Object.assign(result, flattenObject(value, prefix + key + '.'));
      } else {
        result[`${prefix}${key}`] = value;
      }

      return result;
    }, {} as any);
  }

  return obj;
}

/**
 * Returns true if obj and otherObj are equal deeply
 *
 * Note: This automatically unwraps them before comparing if e.g. wrapped with Data or Text
 */
export function equalsObjectDeep(obj: unknown, otherObj: unknown): boolean {
  return fastDeepEqual(unwrapDeep(obj), unwrapDeep(otherObj));
}

/**
 * Returns true if obj is an empty object
 */
export function isEmptyObject(obj: any): boolean {
  return obj && !Object.keys(obj).length;
}

/**
 * Find difference between two objects. Deep compare.
 * @author David Wells- https://davidwells.io/snippets/get-difference-between-two-objects-javascript (Added types)
 */
export function diffObjects<T = any>(
  oldObject: T,
  newObject: T,
): DeepPartial<T> {
  // Lazy load for performance
  const transform =
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    require('lodash/transform') as typeof import('lodash/transform');
  const isEqual =
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    require('lodash/isEqual') as typeof import('lodash/isEqual');

  if (!oldObject || isEmptyObject(oldObject)) {
    return newObject;
  }

  function changes(newObj: any, origObj: any): any {
    let arrayIndexCounter = 0;
    return transform(newObj, (result: any, value, key) => {
      if (!isEqual(value, origObj[key])) {
        // eslint-disable-next-line no-plusplus
        const resultKey = Array.isArray(origObj) ? arrayIndexCounter++ : key;
        // eslint-disable-next-line no-param-reassign
        result[resultKey] =
          isObject(value) &&
          !isNativeObject(value) &&
          isObject(origObj[key]) &&
          !isNativeObject(origObj[key])
            ? changes(value, origObj[key])
            : value;
      }
    });
  }

  return changes(newObject, oldObject);
}
