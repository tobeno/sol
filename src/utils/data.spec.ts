import { Wrapper } from '../modules/data/wrapper';
import { isEmpty, isNotEmpty, unwrap, unwrapDeep } from './data';

describe('data utils', () => {
  describe('isEmpty', () => {
    it('should return true if the value is empty', async () => {
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty(new Wrapper(undefined))).toBe(true);
      expect(isEmpty(new Wrapper(null))).toBe(true);
      expect(isEmpty(new Wrapper(''))).toBe(true);
    });

    it('should return false if the value is not empty', async () => {
      expect(isEmpty(true)).toBe(false);
      expect(isEmpty([])).toBe(false);
      expect(isEmpty({})).toBe(false);
      expect(isEmpty(0)).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should return false if the value is empty', async () => {
      expect(isNotEmpty(undefined)).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty(new Wrapper(undefined))).toBe(false);
      expect(isNotEmpty(new Wrapper(null))).toBe(false);
      expect(isNotEmpty(new Wrapper(''))).toBe(false);
    });

    it('should return true if the value is not empty', async () => {
      expect(isNotEmpty(true)).toBe(true);
      expect(isNotEmpty([])).toBe(true);
      expect(isNotEmpty({})).toBe(true);
      expect(isNotEmpty(0)).toBe(true);
    });
  });

  describe('unwrap', () => {
    it('should unwrap a value', () => {
      const value = new Wrapper(1);
      expect(unwrap(value)).toBe(1);
    });

    it('should return an unwrapped value', () => {
      const value = 1;
      expect(unwrap(value)).toBe(1);
    });

    it('should return an unwrapped value', () => {
      const value = { a: 1 };
      expect(unwrap(value)).toEqual({ a: 1 });
    });
  });

  describe('unwrapDeep', () => {
    it('should unwrap a value deeply', async () => {
      const value = new Wrapper({ a: new Wrapper(1) });
      expect(unwrapDeep(value)).toEqual({ a: 1 });
    });
  });
});
