import { definePropertiesMutation, mutateClass } from './mutation';
import { awaitSync } from './async';
import { inspect } from 'util';

declare global {
  interface Promise<T> {
    get await(): T;
  }
}

mutateClass(
  Promise,
  definePropertiesMutation({
    await: {
      get(): any {
        return awaitSync(this);
      },
    },
    toString: {
      value(): string {
        return String(this.await);
      },
    },
    [inspect.custom]: {
      value(): any {
        const value = this.await as any;

        if (value[inspect.custom]) {
          return value[inspect.custom]();
        }

        return String(value);
      },
    },
  }),
);
