import { describe, expect, it } from 'vitest';
import {
  chunkArray,
  diffArray,
  intersectArray,
  unionArray,
  uniqueArray,
} from './array.utils';

describe('array utils', () => {
  describe('uniqueArray', () => {
    it('should return unique values of an array', async () => {
      const array = [1, 2, 3, 1, 2, 3];
      expect(uniqueArray(array)).toEqual([1, 2, 3]);
    });
  });

  describe('diffArray', () => {
    it('should return the difference of two arrays', async () => {
      const array = [1, 2, 3];
      const otherArray = [2, 3, 4];
      expect(diffArray(array, otherArray)).toEqual([1]);
    });
  });

  describe('unionArray', () => {
    it('should return the union of two arrays', async () => {
      const array = [1, 2, 3];
      const otherArray = [2, 3, 4];
      expect(unionArray(array, otherArray)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('intersectArray', () => {
    it('should return the intersection of two arrays', async () => {
      const array = [1, 2, 3];
      const otherArray = [2, 3, 4];
      expect(intersectArray(array, otherArray)).toEqual([2, 3]);
    });
  });

  describe('chunkArray', () => {
    it('should return the array split up into chunks', async () => {
      const array = [1, 2, 3, 4, 5, 6];
      expect(chunkArray(array, 2)).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });
  });
});
