import { MaybeWrapped } from '../interfaces/data';
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

/**
 * Removes the wrapper class around the value if present.
 */
export function unwrap<ValueType>(value: MaybeWrapped<ValueType>): ValueType {
  return value instanceof Wrapper ? value.value : value;
}
