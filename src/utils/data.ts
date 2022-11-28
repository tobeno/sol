import { MaybeWrapped } from '../interfaces/data';
import { Wrapper } from '../modules/data/wrapper';

/**
 * Returns true if the value is empty.
 */
export function isEmpty(value: any): boolean {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (value instanceof Wrapper && isEmpty(value.value))
  );
}

/**
 * Returns true if the value is not empty.
 */
export function isNotEmpty(value: any): boolean {
  return !isEmpty(value);
}

/**
 * Removes the wrapper class around the value if present.
 */
export function unwrap<ValueType>(value: MaybeWrapped<ValueType>): ValueType {
  return value instanceof Wrapper ? value.value : value;
}

/**
 * Removes the wrapper class around the value and all nested values if present.
 */
export function unwrapDeep(value: any): any {
  if (value instanceof Wrapper) {
    return unwrapDeep(value.value);
  }

  if (Array.isArray(value)) {
    return value.map(unwrapDeep);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((result, key) => {
      result[key] = unwrapDeep(value[key]);

      return result;
    }, {} as any);
  }

  return value;
}
