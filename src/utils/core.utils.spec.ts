import { Wrapper } from '../wrappers/wrapper.wrapper';
import { isEmpty, isNotEmpty } from './core.utils';

describe('core utils', () => {
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
});
