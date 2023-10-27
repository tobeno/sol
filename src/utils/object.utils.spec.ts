import { describe, expect, it } from 'vitest';
import { Wrapper } from '../wrappers/wrapper.wrapper';
import {
  cloneObjectDeep,
  diffObjectKeys,
  equalsObjectDeep,
  flattenObject,
  intersectObjectKeys,
  isNativeObject,
  mapObjectKeys,
  traverseObjectDeep,
  unionObjectKeys,
} from './object.utils';

class DummyWrapper extends Wrapper {}

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

  describe('traverseObjectDeep', () => {
    it('should traverse an object', async () => {
      const obj = { a: 1, b: 2, c: 3, d: [{ e: 4, f: { g: 5 } }] };
      const results: any[] = [];
      traverseObjectDeep(obj, (value) => {
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

  describe('equals', () => {
    it('should return true if two arrays are equal', async () => {
      const data = [1, { b: 2 }, 3];
      const otherData = [1, { b: 2 }, 3];
      expect(equalsObjectDeep(data, otherData)).toBe(true);
    });

    it('should return false if two arrays are not equal', async () => {
      const data = [1, { b: 2 }, 3];
      const otherData = [1, { c: 3 }, 3];
      expect(equalsObjectDeep(data, otherData)).toBe(false);
    });

    it('should return true if two objects are equal', async () => {
      const data = { a: 1, b: 2, c: { d: 3 } };
      const otherData = { a: 1, b: 2, c: { d: 3 } };
      expect(equalsObjectDeep(data, otherData)).toBe(true);
    });

    it('should return false if two objects are not equal', async () => {
      const data = { a: 1, b: 2, c: { d: 3 } };
      const otherData = { a: 1, b: 2, c: { e: 3 } };
      expect(equalsObjectDeep(data, otherData)).toBe(false);
    });

    it('should return true if two objects are equal when first is wrapped', async () => {
      const data = new DummyWrapper({ a: 1, b: 2, c: { d: 3 } });
      const otherData = { a: 1, b: 2, c: { d: 3 } };
      expect(equalsObjectDeep(data, otherData)).toBe(true);
    });

    it('should return false if two objects are not equal when first is wrapped', async () => {
      const data = new DummyWrapper({ a: 1, b: 2, c: { d: 3 } });
      const otherData = { a: 1, b: 2, c: { e: 3 } };
      expect(equalsObjectDeep(data, otherData)).toBe(false);
    });

    it('should return true if two objects are equal when second is wrapped', async () => {
      const data = { a: 1, b: 2, c: { d: 3 } };
      const otherData = new DummyWrapper({ a: 1, b: 2, c: { d: 3 } });
      expect(equalsObjectDeep(data, otherData)).toBe(true);
    });

    it('should return false if two objects are not equal when second is wrapped', async () => {
      const data = { a: 1, b: 2, c: { d: 3 } };
      const otherData = new DummyWrapper({ a: 1, b: 2, c: { e: 3 } });
      expect(equalsObjectDeep(data, otherData)).toBe(false);
    });
  });
});
