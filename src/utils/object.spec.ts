import {
  cloneObjectDeep,
  diffObjectKeys,
  flattenObject,
  intersectObjectKeys,
  isNativeObject,
  mapObjectKeys,
  traverseObject,
  unionObjectKeys,
} from './object';
import { Wrapper } from '../modules/data/wrapper';

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

  describe('isNativeObject', () => {
    it.each([
      [null, false],
      [undefined, false],
      [true, false],
      ['', false],
      [{}, false],
      [[], false],
      [new Wrapper({}), false],
      [new Date(), true],
      [new Error(), true],
    ])('should for %j return %j', (value, expected) => {
      expect(isNativeObject(value)).toBe(expected);
    });
  });

  describe('intersectObjectKeys', () => {
    it('should return the intersection of the keys of two objects', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const otherObj = { b: 2, c: 3, d: 4 };
      expect(intersectObjectKeys(obj, otherObj)).toEqual({ b: 2, c: 3 });
    });
  });

  describe('diffObjectKeys', () => {
    it('should return the different of the keys of two objects', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const otherObj = { b: 2, c: 3, d: 4 };
      expect(diffObjectKeys(obj, otherObj)).toEqual({ a: 1 });
    });
  });

  describe('unionObjectKeys', () => {
    it('should return the union of the keys of two objects', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const otherObj = { b: 2, c: 3, d: 4 };
      expect(unionObjectKeys(obj, otherObj)).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      });
    });
  });

  describe('traverseObject', () => {
    it('should traverse an object', async () => {
      const obj = { a: 1, b: 2, c: 3, d: [{ e: 4, f: { g: 5 } }] };
      const results: any[] = [];
      traverseObject(obj, (value) => {
        results.push(value);
      });
      expect(results).toEqual([
        { g: 5 },
        { e: 4, f: { g: 5 } },
        { a: 1, b: 2, c: 3, d: [{ e: 4, f: { g: 5 } }] },
      ]);
    });
  });

  describe('cloneObjectDeep', () => {
    it('should clone an object', () => {
      const obj = { a: 1, b: 2, c: 3, d: [{ e: 4, f: { g: 5 } }] };
      const cloned = cloneObjectDeep(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });
  });

  describe('mapObjectKeys', () => {
    it('should map the keys of an object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(mapObjectKeys(obj, (key) => key.toUpperCase())).toEqual({
        A: 1,
        B: 2,
        C: 3,
      });
    });
  });
});
