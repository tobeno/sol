import { definePropertiesMutation, mutateClass } from '../utils/mutation.utils';

declare global {
  interface Promise<T> {
    /**
     * Awaits the promise synchronously.
     */
    get awaited(): T;
  }
}

mutateClass(
  Promise,
  definePropertiesMutation({
    awaited: {
      get(): any {
        throw new Error('Only works in REPL.');
      },
    },
  }),
);
