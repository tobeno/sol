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
 * Runs callback for all (nested) objects included in obj, including the root object
 */
export function traverseObject(
  obj: any,
  cb: (item: Record<string | number | symbol, any>) => void,
): void {
  if (!obj || obj instanceof Date) {
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      traverseObject(item, cb);
    });

    return;
  }

  if (typeof obj === 'object') {
    Object.values(obj).forEach((value) => {
      traverseObject(value, cb);
    });

    cb(obj);
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
