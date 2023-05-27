import { snakeCase } from 'change-case';
import { Data } from './data.wrapper';
import { Text } from './text.wrapper';

describe('Data', () => {
  describe('cloned', () => {
    it('should clone the data', async () => {
      const data = Data.create({
        a: 1,
      });

      const cloned = data.cloned;

      expect(cloned.value).toEqual(data.value);
      expect(cloned.value).not.toBe(data.value);
    });
  });

  describe('flattened', () => {
    it('should flatten objects', async () => {
      const data = Data.create({
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
          f: [4],
        },
      });

      expect(data.flattened.value).toEqual({
        a: 1,
        'b.c': 2,
        'b.d.e': 3,
        'b.f': [4],
      });
    });

    it('should flatten arrays by one level', async () => {
      const data = Data.create([1, [2, [3]]]);

      expect(data.flattened.value).toEqual([1, 2, [3]]);
    });

    it('should ignore plain values', async () => {
      const data = Data.create(1);

      expect(data.flattened.value).toBe(1);
    });
  });

  describe('first', () => {
    it('should return first item of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.first?.value).toBe(1);
    });

    it('should return first item of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.first?.value).toBe(1);
    });
  });

  describe('last', () => {
    it('should return last item of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.last?.value).toBe(3);
    });

    it('should return last item of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.last?.value).toBe(3);
    });
  });

  describe('sum', () => {
    it('should sum an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.sum).toBe(6);
    });

    it('should sum an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.sum).toBe(6);
    });
  });

  describe('avg', () => {
    it('should return the average of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.avg).toBe(2);
    });

    it('should return the average of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.avg).toBe(2);
    });
  });

  describe('min', () => {
    it('should return the minimum of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.min).toBe(1);
    });

    it('should return the minimum of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.min).toBe(1);
    });
  });

  describe('max', () => {
    it('should return the maximum of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.max).toBe(3);
    });

    it('should return the maximum of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.max).toBe(3);
    });
  });

  describe('length', () => {
    it('should return the length of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.length).toBe(3);
    });

    it('should return the length of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.length).toBe(3);
    });
  });

  describe('unique', () => {
    it('should return unique values of an array', async () => {
      const data = Data.create([1, 1, 2, 3]);

      expect(data.unique.value).toEqual([1, 2, 3]);
    });

    it('should return unique values of an array of wrapped values', async () => {
      const data = Data.create([
        Text.create('a'),
        Text.create('a'),
        Text.create('b'),
        Text.create('c'),
      ]);

      expect(data.unique.value).toEqual([
        Text.create('a'),
        Text.create('b'),
        Text.create('c'),
      ]);
    });

    it('should return unique values of an object', async () => {
      const data = Data.create({ a: 1, b: 1, c: 2, d: 3 });

      expect(data.unique.value).toEqual({ a: 1, c: 2, d: 3 });
    });
  });

  describe('sorted', () => {
    it('should return the array sorted', async () => {
      const data = Data.create([3, 1, 2]);

      expect(data.sorted.value).toEqual([1, 2, 3]);
    });

    it('should return the object sorted', async () => {
      const data = Data.create({ c: 3, e: 1, b: 2 });

      expect(data.sorted.value).toEqual({ e: 1, b: 2, c: 3 });
    });
  });

  describe('sortedKeys', () => {
    it('should throw an error if trying to sort an array by keys', async () => {
      const data = Data.create([3, 1, 2]);

      expect(() => {
        data.sortedKeys;
      }).toThrow();
    });

    it('should return the object sorted by keys', async () => {
      const data = Data.create({ c: 3, e: 1, b: 2 });

      expect(data.sortedKeys.value).toEqual({ b: 2, c: 3, e: 1 });
    });
  });

  describe('joined', () => {
    it('should join an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.joined.value).toBe('1\n2\n3');
    });

    it('should join an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.joined.value).toBe('1\n2\n3');
    });
  });

  describe('reversed', () => {
    it('should reverse an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.reversed.value).toEqual([3, 2, 1]);
    });

    it('should reverse an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.reversed.value).toEqual({ c: 3, b: 2, a: 1 });
    });
  });

  describe('filtered', () => {
    it('should filter an array', async () => {
      const data = Data.create([null, 2, '', 3]);

      expect(data.filtered.value).toEqual([2, 3]);
    });

    it('should filter an object', async () => {
      const data = Data.create({ a: null, b: 2, c: '', d: 3 });

      expect(data.filtered.value).toEqual({ b: 2, d: 3 });
    });
  });

  describe('camelcased', () => {
    it('should camelCase an array', async () => {
      const data = Data.create(['hello-world', 'world_world', 'hello world']);

      expect(data.camelcased.value).toEqual([
        'helloWorld',
        'worldWorld',
        'helloWorld',
      ]);
    });

    it('should camelCase an object', async () => {
      const data = Data.create({
        'hello-world': 'hello-world',
        hello_world: 'hello-world2',
        'hello world': 'hello-world3',
      });

      expect(data.camelcased.value).toEqual({
        helloWorld: 'hello-world3',
      });
    });
  });

  describe('kebabcased', () => {
    it('should kebab-case an array', async () => {
      const data = Data.create(['hello-world', 'world_world', 'hello world']);

      expect(data.kebabcased.value).toEqual([
        'hello-world',
        'world-world',
        'hello-world',
      ]);
    });

    it('should kebab-case an object', async () => {
      const data = Data.create({
        'hello-world': 'hello-world',
        hello_world: 'hello-world2',
        'hello world': 'hello-world3',
      });

      expect(data.kebabcased.value).toEqual({
        'hello-world': 'hello-world3',
      });
    });
  });

  describe('snakecased', () => {
    it('should snake_case an array', async () => {
      const data = Data.create(['hello-world', 'world_world', 'hello world']);

      expect(data.snakecased.value).toEqual([
        'hello_world',
        'world_world',
        'hello_world',
      ]);
    });

    it('should snake_case an object', async () => {
      const data = Data.create({
        'hello-world': 'hello-world',
        hello_world: 'hello-world2',
        'hello world': 'hello-world3',
      });

      expect(data.snakecased.value).toEqual({
        hello_world: 'hello-world3',
      });
    });
  });

  describe('constantcased', () => {
    it('should CONSTANT_CASE an array', async () => {
      const data = Data.create(['hello-world', 'world_world', 'hello world']);

      expect(data.constantcased.value).toEqual([
        'HELLO_WORLD',
        'WORLD_WORLD',
        'HELLO_WORLD',
      ]);
    });

    it('should CONSTANT_CASE an object', async () => {
      const data = Data.create({
        'hello-world': 'hello-world',
        hello_world: 'hello-world2',
        'hello world': 'hello-world3',
      });

      expect(data.constantcased.value).toEqual({
        HELLO_WORLD: 'hello-world3',
      });
    });
  });

  describe('titlecased', () => {
    it('should Title Case an array', async () => {
      const data = Data.create(['hello-world', 'world_world', 'hello world']);

      expect(data.titlecased.value).toEqual([
        'Hello World',
        'World World',
        'Hello World',
      ]);
    });

    it('should Title Case an object', async () => {
      const data = Data.create({
        'hello-world': 'hello-world',
        hello_world: 'hello-world2',
        'hello world': 'hello-world3',
      });

      expect(data.titlecased.value).toEqual({
        'Hello World': 'hello-world3',
      });
    });
  });

  describe('pascalcased', () => {
    it('should PascalCase an array', async () => {
      const data = Data.create(['hello-world', 'world_world', 'hello world']);

      expect(data.pascalcased.value).toEqual([
        'HelloWorld',
        'WorldWorld',
        'HelloWorld',
      ]);
    });

    it('should PascalCase an object', async () => {
      const data = Data.create({
        'hello-world': 'hello-world',
        hello_world: 'hello-world2',
        'hello world': 'hello-world3',
      });

      expect(data.pascalcased.value).toEqual({
        HelloWorld: 'hello-world3',
      });
    });
  });

  describe('merged', () => {
    it('should merge an array', async () => {
      const data = Data.create([{ a: 1 }, { b: 2 }, { c: 3 }]);

      expect(data.merged.value).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should merge an object', async () => {
      const data = Data.create({ a: { a: 1 }, b: { b: 2 }, c: { c: 3 } });

      expect(data.merged.value).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('empty', () => {
    it('should return true if the value is empty', async () => {
      expect(Data.create('').empty).toBe(true);
      expect(Data.create(null).empty).toBe(true);
      expect(Data.create(undefined).empty).toBe(true);
    });

    it('should return true if the value is not empty', async () => {
      expect(Data.create('1').empty).toBe(false);
      expect(Data.create(0).empty).toBe(false);
      expect(Data.create([]).empty).toBe(false);
      expect(Data.create({}).empty).toBe(false);
    });
  });

  describe('notEmpty', () => {
    it('should return true if the value is not empty', async () => {
      expect(Data.create('a').notEmpty).toBe(true);
      expect(Data.create(0).notEmpty).toBe(true);
      expect(Data.create([]).notEmpty).toBe(true);
    });

    it('should return false if the value is empty', async () => {
      expect(Data.create('').notEmpty).toBe(false);
      expect(Data.create(null).notEmpty).toBe(false);
      expect(Data.create(undefined).notEmpty).toBe(false);
    });
  });

  describe('objects', () => {
    it('should returns all objects within an array', async () => {
      const data = Data.create([{ a: 1 }, 2, { b: 2 }, 3, { c: 3 }]);

      expect(data.objects.value).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
    });

    it('should returns all objects within an object', async () => {
      const data = Data.create({
        a: { a: 1 },
        b: 2,
        c: { b: 2 },
        d: 3,
        e: { c: 3 },
      });

      expect(data.objects.value).toEqual([
        { a: 1 },
        { b: 2 },
        { c: 3 },
        {
          a: { a: 1 },
          b: 2,
          c: { b: 2 },
          d: 3,
          e: { c: 3 },
        },
      ]);
    });
  });

  describe('each', () => {
    it('should map all items in an array with the given operation', async () => {
      const data = Data.create([1, 2, 3]);

      expect((data.each.toString() as any).value).toEqual(['1', '2', '3']);
    });

    it('should map all items in an object with the given operation', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect((data.each.toString() as any).value).toEqual({
        a: '1',
        b: '2',
        c: '3',
      });
    });
  });

  describe('keys', () => {
    it('should return the keys of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.keys.value).toEqual([0, 1, 2]);
    });

    it('should return the keys of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.keys.value).toEqual(['a', 'b', 'c']);
    });
  });

  describe('values', () => {
    it('should return the values of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.values.value).toEqual([1, 2, 3]);
    });

    it('should returns the values of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.values.value).toEqual([1, 2, 3]);
    });
  });

  describe('length', () => {
    it('should return the length of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data).toHaveLength(3);
    });

    it('should return the length of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data).toHaveLength(3);
    });
  });

  describe('entries', () => {
    it('should return the entries of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.entries.value).toEqual([
        [0, 1],
        [1, 2],
        [2, 3],
      ]);
    });

    it('should return the entries of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.entries.value).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });
  });

  describe('unentries', () => {
    it('should build an array from the entries', async () => {
      const data = Data.create([
        [0, 1],
        [1, 2],
        [2, 3],
      ]);

      expect(data.unentries.value).toEqual([1, 2, 3]);
    });

    it('should build an object from the entries', async () => {
      const data = Data.create([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);

      expect(data.unentries.value).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('get', () => {
    it('should get an item of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.get(1)?.value).toEqual(2);
    });

    it('should get an item of an object', async () => {
      const data = Data.create({ a: 1, b: { e: 4 }, c: 3 });

      expect(data.get('c')?.value).toEqual(3);
      expect(data.get('b.e')?.value).toEqual(4);
    });
  });

  describe('set', () => {
    it('should set an item of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.set(1, 4).value).toEqual([1, 4, 3]);
    });

    it('should set an item of an object', async () => {
      const data = Data.create({ a: 1, b: { e: 4 }, c: 3 });

      expect(data.set('c', 4).value).toEqual({ a: 1, b: { e: 4 }, c: 4 });
    });
  });

  describe('changeCase', () => {
    it('should change case of an array', async () => {
      const data = Data.create(['hello-world', 'world_world', 'hello world']);

      expect(data.changeCase(snakeCase).value).toEqual([
        'hello_world',
        'world_world',
        'hello_world',
      ]);
    });

    it('should change case of an object', async () => {
      const data = Data.create({
        'hello-world': 'hello-world',
        hello_world: 'hello-world2',
        'hello world': 'hello-world3',
      });

      expect(data.changeCase(snakeCase).value).toEqual({
        hello_world: 'hello-world3',
      });
    });
  });

  describe('union', () => {
    it('should return the union of two arrays', async () => {
      const data = Data.create([1, 2, 3]);
      const otherData = Data.create([3, 4]);
      expect(data.union(otherData).value).toEqual([1, 2, 3, 4]);
    });

    it('should return the union of two objects', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });
      const otherData = Data.create({ c: 3, d: 4 });
      expect(data.union(otherData).value).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });
  });

  describe('diff', () => {
    it('should return the diff of two arrays', async () => {
      const data = Data.create([1, 2, 3]);
      const otherData = Data.create([3, 4]);
      expect(data.diff(otherData).value).toEqual([1, 2]);
    });

    it('should return the diff of two objects', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });
      const otherData = Data.create({ c: 3, d: 4 });
      expect(data.diff(otherData).value).toEqual({ a: 1, b: 2 });
    });
  });

  describe('intersect', () => {
    it('should return the intersection of two arrays', async () => {
      const data = Data.create([1, 2, 3]);
      const otherData = Data.create([3, 4]);
      expect(data.intersect(otherData).value).toEqual([3]);
    });

    it('should return the intersection of two objects', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });
      const otherData = Data.create({ c: 3, d: 4 });
      expect(data.intersect(otherData).value).toEqual({ c: 3 });
    });
  });

  describe('group', () => {
    it('should group array values', async () => {
      const data = Data.create([1, 2, 3, 4, 5]);

      expect(data.group((item) => (item > 2 ? '>2' : '<=2')).value).toEqual({
        '<=2': [1, 2],
        '>2': [3, 4, 5],
      });
    });

    it('should group array values using custom reducer and group fn', async () => {
      const data = Data.create([1, 2, 3, 4, 5]);

      expect(
        data.group(
          (item) => (item > 2 ? '>2' : '<=2'),
          (result, item) => result + item,
          () => 0,
        ).value,
      ).toEqual({
        '<=2': 3,
        '>2': 12,
      });
    });

    it('should group object values', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3, d: 4, e: 5 });

      expect(data.group((item) => (item > 2 ? '>2' : '<=2')).value).toEqual({
        '<=2': [1, 2],
        '>2': [3, 4, 5],
      });
    });

    it('should group object values using custom reducer and group fn', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3, d: 4, e: 5 });

      expect(
        data.group(
          (item) => (item > 2 ? '>2' : '<=2'),
          (result, item) => result + item,
          () => 0,
        ).value,
      ).toEqual({
        '<=2': 3,
        '>2': 12,
      });
    });
  });

  describe('groupCount', () => {
    it('should count group items of an array', async () => {
      const data = Data.create([1, 2, 3, 4, 5]);

      expect(
        data.groupCount((item) => (item > 2 ? '>2' : '<=2')).value,
      ).toEqual({
        '<=2': 2,
        '>2': 3,
      });
    });

    it('should count group items of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3, d: 4, e: 5 });

      expect(
        data.groupCount((item) => (item > 2 ? '>2' : '<=2')).value,
      ).toEqual({
        '<=2': 2,
        '>2': 3,
      });
    });
  });

  describe('equals', () => {
    it('should return true if two arrays are equal', async () => {
      const data = Data.create([1, { b: 2 }, 3]);
      const otherData = Data.create([1, { b: 2 }, 3]);
      expect(data.equals(otherData)).toBe(true);
    });

    it('should return false if two arrays are not equal', async () => {
      const data = Data.create([1, { b: 2 }, 3]);
      const otherData = Data.create([1, { c: 3 }, 3]);
      expect(data.equals(otherData)).toBe(false);
    });

    it('should return true if two objects are equal', async () => {
      const data = Data.create({ a: 1, b: 2, c: { d: 3 } });
      const otherData = Data.create({ a: 1, b: 2, c: { d: 3 } });
      expect(data.equals(otherData)).toBe(true);
    });

    it('should return false if two objects are not equal', async () => {
      const data = Data.create({ a: 1, b: 2, c: { d: 3 } });
      const otherData = Data.create({ a: 1, b: 2, c: { e: 3 } });
      expect(data.equals(otherData)).toBe(false);
    });
  });

  describe('sort', () => {
    it('should sort an array', async () => {
      const data = Data.create(['1', '5', '2', '3', '4', '10']);

      expect(data.sort().value).toEqual(['1', '10', '2', '3', '4', '5']);
    });

    it('should sort an array using custom compare', async () => {
      const data = Data.create(['1', '5', '2', '3', '4', '10']);

      expect(data.sort((a, b) => Number(a) - Number(b)).value).toEqual([
        '1',
        '2',
        '3',
        '4',
        '5',
        '10',
      ]);
    });
  });

  describe('sortKeys', () => {
    it('should throw an error if trying to sort keys of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(() => data.sortKeys()).toThrow();
    });

    it('should sort keys of an object', async () => {
      const data = Data.create({ a: 1, c: 2, b: 3 });

      expect(data.sortKeys().value).toEqual({ a: 1, b: 3, c: 2 });
    });

    it('should sort keys of an object using a custom compare', async () => {
      const data = Data.create({ '1': 1, '10': 2, '2': 3 });

      expect(data.sortKeys((a, b) => Number(a) - Number(b)).value).toEqual({
        '1': 1,
        '2': 3,
        '10': 2,
      });
    });
  });

  describe('filter', () => {
    it('should filter an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.filter((value) => value > 1).value).toEqual([2, 3]);
    });

    it('should filter an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.filter((value) => value > 1).value).toEqual({ b: 2, c: 3 });
    });
  });

  describe('find', () => {
    it('should find the first match in an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.find((value) => value > 1)?.value).toBe(2);
    });

    it('should find the first match in an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.find((value) => value > 1)?.value).toBe(2);
    });
  });

  describe('findKey', () => {
    it('should find the first matching key in an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.findKey((value) => value > 1)).toBe(1);
    });

    it('should find the first matching key in an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.findKey((value) => value > 1)).toBe('b');
    });
  });

  describe('traverse', () => {
    it('should traverse an array', async () => {
      const data = Data.create([1, { a: 1, b: { c: 2 } }, 3]);

      const values: any[] = [];
      data.traverse((value) => {
        values.push(value);
      });

      expect(values).toEqual([{ c: 2 }, { a: 1, b: { c: 2 } }]);
    });

    it('should traverse an object', async () => {
      const data = Data.create({ a: 1, b: { c: 2 }, d: [{ e: 3 }] });

      const values: any[] = [];
      data.traverse((value) => {
        values.push(value);
      });

      expect(values).toEqual([
        { c: 2 },
        { e: 3 },
        { a: 1, b: { c: 2 }, d: [{ e: 3 }] },
      ]);
    });
  });

  describe('chunk', () => {
    it('should chunk an array', async () => {
      const data = Data.create([1, 2, 3, 4, 5, 6]);

      expect(data.chunk(2).value).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });

    it('should chunk an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 });

      expect(data.chunk(2).value).toEqual([
        { a: 1, b: 2 },
        { c: 3, d: 4 },
        { e: 5, f: 6 },
      ]);
    });
  });

  describe('some', () => {
    it('should return true if match in array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.some((value) => value > 1)).toBe(true);
    });

    it('should return false if no match in array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.some((value) => value > 3)).toBe(false);
    });

    it('should return true if match in object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.some((value) => value > 1)).toBe(true);
    });

    it('should return false if no match in object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.some((value) => value > 3)).toBe(false);
    });
  });

  describe('every', () => {
    it('should return true if all match in array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.every((value) => value > 0)).toBe(true);
    });

    it('should return false if not all match in array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.every((value) => value > 1)).toBe(false);
    });

    it('should return true if all match in object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.every((value) => value > 0)).toBe(true);
    });

    it('should return false if not all match in object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.every((value) => value > 1)).toBe(false);
    });
  });

  describe('pipe', () => {
    it('should pipe an operation for an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.pipe((value) => value.map((v) => v * 2)).value).toEqual([
        2, 4, 6,
      ]);
    });

    it('should pipe an operation for an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(
        data.pipe((value) =>
          Object.fromEntries(
            Object.entries(value).map(([key, value]) => [key, value * 2]),
          ),
        ).value,
      ).toEqual({ a: 2, b: 4, c: 6 });
    });
  });

  describe('reduce', () => {
    it('should reduce an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.reduce((result, value) => result + value, 0).value).toBe(6);
    });

    it('should reduce an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.reduce((result, value) => result + value, 0).value).toBe(6);
    });
  });

  describe('map', () => {
    it('should map an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.map((value) => value * 2).value).toEqual([2, 4, 6]);
    });

    it('should map an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.map((value) => value * 2).value).toEqual({
        a: 2,
        b: 4,
        c: 6,
      });
    });
  });

  describe('mapKeys', () => {
    it('should throw an error if trying to map the keys of an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(() => {
        data.mapKeys((key) => key * 2);
      }).toThrow();
    });

    it('should map the keys of an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.mapKeys((key) => key + 'x').value).toEqual({
        ax: 1,
        bx: 2,
        cx: 3,
      });
    });
  });

  describe('slice', () => {
    it('should slice an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.slice(1).value).toEqual([2, 3]);
    });

    it('should slice an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.slice(1).value).toEqual({ b: 2, c: 3 });
    });
  });

  describe('join', () => {
    it('should join an array', async () => {
      const data = Data.create([1, 2, 3]);

      expect(data.join(', ').value).toBe('1, 2, 3');
    });

    it('should join an object', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.join(', ').value).toBe('1, 2, 3');
    });
  });

  // --- Extensions / Mutations ---
  describe('json', () => {
    it('should return JSON', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.json.value).toMatchSnapshot();
    });
  });

  describe('yaml', () => {
    it('should return YAML', async () => {
      const data = Data.create({ a: 1, b: 2, c: 3 });

      expect(data.yaml.value).toMatchSnapshot();
    });
  });

  describe('csv', () => {
    it('should return CSV', async () => {
      const data = Data.create([{ a: 1, b: 2 }, { a: 2 }]);

      expect(data.csv.value).toMatchSnapshot();
    });
  });
});
