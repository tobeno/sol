import { inspect } from 'util';
import { awaitSync } from '../../../utils/async.utils';
import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';

declare global {
  interface Promise<T> {
    /**
     * Awaits the promise synchronously.
     */
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
