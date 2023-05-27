import { Wrapper } from '../wrappers/wrapper.wrapper';

/**
 * Returns true if the value is empty
 */
export function isEmpty(value: any): value is null | undefined | '' {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (value instanceof Wrapper && isEmpty(value.value))
  );
}

/**
 * Returns true if the value is not empty
 */
export function isNotEmpty<ValueType>(
  value: ValueType,
): value is NonNullable<ValueType> {
  return !isEmpty(value);
}

/**
 * Returns true if the value is null or undefined.
 */
export function isNullable(value: any): value is null | undefined {
  return value === undefined || value === null;
}

/**
 * Returns true if the value is not null or undefined.
 */
export function isNonNullable<ValueType>(
  value: ValueType,
): value is NonNullable<ValueType> {
  return !isNullable(value);
}

/**
 * Returns true if the value is an object.
 */
export function isObject(value: any): value is Record<string, any> {
  return value && typeof value === 'object';
}

/**
 * Returns true if the value is an array.
 */
export function isArray<ItemType = any>(value: any): value is ItemType[] {
  return Array.isArray(value);
}

/**
 * Returns true if the value is a string.
 */
export function isString(value: any): value is string {
  return typeof value === 'string';
}

/**
 * Returns true if the value is a number.
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

/**
 * Returns true if the value is a boolean.
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Returns true if the value is a Date.
 */
export function isDate(value: any): value is Date {
  return value instanceof Date;
}

/**
 * Returns true if the value is an Error.
 */
export function isError(value: any): value is Error {
  return value instanceof Error;
}

/**
 * Ensures a value is not null or undefined.
 */
export function ensureNonNullable<ValueType>(
  value: ValueType,
): NonNullable<ValueType> {
  if (!isNonNullable(value)) {
    throw new Error('Value is null or undefined.');
  }

  return value;
}

/**
 * Ensures a value is not empty.
 */
export function ensureNonEmpty<ValueType>(
  value: ValueType,
): NonNullable<ValueType> {
  if (!isNotEmpty(value)) {
    throw new Error('Value is empty.');
  }

  return value;
}

/**
 * Ensures a value is not null or undefined.
 */
export function ensureObject<ResultType extends Record<string, any>>(
  value: any,
): ResultType {
  if (!isObject(value)) {
    throw new Error('Value is not an object.');
  }

  return value as any;
}

/**
 * Ensures a value is not null or undefined.
 */
export function ensureArray<ItemType = any>(value: any): ItemType[] {
  if (!isArray(value)) {
    throw new Error('Value is not an array.');
  }

  return value;
}

/**
 * Ensures a value is a string.
 */
export function ensureString(value: any): string {
  if (!isString(value)) {
    throw new Error('Value is not a string.');
  }

  return value;
}

/**
 * Ensures a value is a number.
 */
export function ensureNumber(value: any): number {
  if (!isNumber(value)) {
    throw new Error('Value is not a number.');
  }

  return value;
}

/**
 * Ensures a value is a boolean.
 */
export function ensureBoolean(value: any): boolean {
  if (!isBoolean(value)) {
    throw new Error('Value is not a boolean.');
  }

  return value;
}

/**
 * Ensures a value is a Date.
 */
export function ensureDate(value: any): Date {
  if (!isDate(value)) {
    throw new Error('Value is not a Date.');
  }

  return value;
}

/**
 * Ensures a value is an Error.
 */
export function ensureError(value: any): Error {
  if (!isError(value)) {
    throw new Error('Value is not an Error.');
  }

  return value;
}
