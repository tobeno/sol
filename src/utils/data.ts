import { Wrapper } from '../modules/data/wrapper';

/**
 * Returns true if the value is falsy.
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
 * Returns true if the value is truthy.
 */
export function isNotEmpty(value: any): boolean {
  return !isEmpty(value);
}
