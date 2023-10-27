import { describe, expect, it } from 'vitest';
import {
  definePropertiesMutation,
  mutateClass,
  mutateFunction,
  mutateObject,
  unmutateClass,
  unmutateFunction,
  unmutateObject,
} from './mutation.utils';

describe('mutation', () => {
  describe('mutateClass', () => {
    it('should mutate a class', async () => {
      class Test {
        someField = 'test';

        someMethod(toAdd: string) {
          this.someField += toAdd;
        }
      }

      const test = new Test();
      test.someMethod('1');
      expect(test.someField).toBe('test1');

      mutateClass(
        Test,
        definePropertiesMutation({
          newMethod: {
            value() {
              this.someMethod('1');
            },
          },
        }),
      );

      // Check if the mutation affects existing instances
      (test as any).newMethod();
      expect(test.someField).toBe('test11');

      // Check if the mutation affects new instances
      const test2 = new Test();
      (test2 as any).newMethod();
      expect(test2.someField).toBe('test1');
    });

    it('should mutate a class only once', async () => {
      class Test {
        someField = 'test';

        someMethod(toAdd: string) {
          this.someField += toAdd;
        }
      }

      const test = new Test();
      test.someMethod('1');
      expect(test.someField).toBe('test1');

      const mutation = definePropertiesMutation<Test>({
        newMethod: {
          value() {
            this.someMethod('1');
          },
        },
      });

      mutateClass(Test, mutation);
      mutateClass(Test, mutation);

      // Check if the mutation affects existing instances
      (test as any).newMethod();
      expect(test.someField).toBe('test11');

      // Check if the mutation affects new instances
      const test2 = new Test();
      (test2 as any).newMethod();
      expect(test2.someField).toBe('test1');
    });

    it('should apply multiple mutations', async () => {
      class Test {
        someField = 'test';

        someMethod(toAdd: string) {
          this.someField += toAdd;
        }
      }

      const test = new Test();
      test.someMethod('1');
      expect(test.someField).toBe('test1');

      mutateClass(
        Test,
        definePropertiesMutation({
          newMethod: {
            value() {
              this.someMethod('1');
            },
          },
        }),
      );

      mutateClass(
        Test,
        definePropertiesMutation({
          newMethod2: {
            value() {
              this.someMethod('2');
            },
          },
        }),
      );

      // Check if the mutation affects existing instances
      (test as any).newMethod();
      (test as any).newMethod2();
      expect(test.someField).toBe('test112');

      // Check if the mutation affects new instances
      const test2 = new Test();
      (test2 as any).newMethod();
      (test2 as any).newMethod2();
      expect(test2.someField).toBe('test12');
    });
  });

  describe('unmutateClass', () => {
    it('should unmutate a class', async () => {
      class Test {
        someField = 'test';

        someMethod(toAdd: string) {
          this.someField += toAdd;
        }
      }

      const test = new Test();
      test.someMethod('1');
      expect(test.someField).toBe('test1');

      const mutation = definePropertiesMutation<Test>({
        newMethod: {
          value() {
            this.someMethod('1');
          },
        },
      });

      mutateClass(Test, mutation);

      mutateClass(
        Test,
        definePropertiesMutation({
          newMethod2: {
            value() {
              this.someMethod('2');
            },
          },
        }),
      );

      (test as any).newMethod();
      (test as any).newMethod2();
      expect(test.someField).toBe('test112');

      unmutateClass(Test, mutation);

      expect(test).not.toHaveProperty('newMethod');
      (test as any).newMethod2();
      expect(test.someField).toBe('test1122');
    });

    it('should unmutate the specified mutation only', async () => {
      class Test {
        someField = 'test';

        someMethod(toAdd: string) {
          this.someField += toAdd;
        }
      }

      const test = new Test();
      test.someMethod('1');
      expect(test.someField).toBe('test1');

      const mutation = definePropertiesMutation<Test>({
        newMethod: {
          value() {
            this.someMethod('1');
          },
        },
      });

      mutateClass(Test, mutation);

      (test as any).newMethod();
      expect(test.someField).toBe('test11');

      unmutateClass(Test, mutation);

      expect(test).not.toHaveProperty('newMethod');
      expect(test.someField).toBe('test11');
    });

    it('should unmutate all', async () => {
      class Test {
        someField = 'test';

        someMethod(toAdd: string) {
          this.someField += toAdd;
        }
      }

      const test = new Test();
      test.someMethod('1');
      expect(test.someField).toBe('test1');

      mutateClass(
        Test,
        definePropertiesMutation({
          newMethod: {
            value() {
              this.someMethod('1');
            },
          },
        }),
      );

      mutateClass(
        Test,
        definePropertiesMutation({
          newMethod2: {
            value() {
              this.someMethod('2');
            },
          },
        }),
      );

      // Check if the mutation affects existing instances
      (test as any).newMethod();
      (test as any).newMethod2();
      expect(test.someField).toBe('test112');

      unmutateClass(Test);

      expect(test).not.toHaveProperty('newMethod');
      expect(test).not.toHaveProperty('newMethod2');
      expect(test.someField).toBe('test112');
    });
  });

  describe('mutateObject', () => {
    it('should mutate a object', async () => {
      const test = {
        someField: 'test',
        someMethod(toAdd: string) {
          this.someField += toAdd;
        },
      };
      test.someMethod('1');
      expect(test.someField).toBe('test1');

      mutateObject(
        test,
        definePropertiesMutation({
          newMethod: {
            value() {
              this.someMethod('1');
            },
          },
        }),
      );

      (test as any).newMethod();
      expect(test.someField).toBe('test11');
    });
  });

  describe('unmutateObject', () => {
    it('should unmutate a object', async () => {
      const test = {
        someField: 'test',
        someMethod(toAdd: string) {
          this.someField += toAdd;
        },
      };
      test.someMethod('1');
      expect(test.someField).toBe('test1');

      const mutation = definePropertiesMutation<typeof test>({
        newMethod: {
          value() {
            this.someMethod('1');
          },
        },
      });

      mutateObject(test, mutation);

      (test as any).newMethod();
      expect(test.someField).toBe('test11');

      unmutateObject(test, mutation);

      expect(test).not.toHaveProperty('newMethod');
      expect(test.someField).toBe('test11');
    });
  });

  describe('mutateFunction', () => {
    it('should mutate a function', async () => {
      const join = (...args: string[]) => args.join('');
      expect(join('test', '1')).toBe('test1');

      mutateFunction(
        join,
        definePropertiesMutation<typeof join>({
          duplicate: {
            value(input: string) {
              return this(input, input);
            },
          },
        }),
      );

      expect((join as any).duplicate('test')).toBe('testtest');
    });
  });

  describe('unmutateFunction', () => {
    it('should unmutate a function', async () => {
      const join = (...args: string[]) => args.join('');
      expect(join('test', '1')).toBe('test1');

      const mutation = definePropertiesMutation<typeof join>({
        duplicate: {
          value(input: string) {
            return this(input, input);
          },
        },
      });

      mutateFunction(join, mutation);

      expect((join as any).duplicate('test')).toBe('testtest');

      unmutateFunction(join, mutation);

      expect(join).not.toHaveProperty('duplicate');
      expect(join('test', '1')).toBe('test1');
    });
  });
});
