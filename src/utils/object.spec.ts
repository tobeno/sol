import { flattenObject } from './object';

describe('object utils', function () {
  describe('flattenObject', function () {
    it('should flatten a object', function () {
      expect(
        flattenObject({ a: { b: { c: 1 } }, e: [2], f: 3, g: [{ id: 4 }] }),
      ).toEqual({
        'a.b.c': 1,
        e: [2],
        f: 3,
        g: [{ id: 4 }],
      });
    });
  });
});
