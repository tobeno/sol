import { Wrapper } from '../wrappers/wrapper.wrapper';
import { unwrap, unwrapDeep } from './data.utils';

describe('data utils', () => {
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
