import { definePropertiesMutation, mutateClass } from '../utils/mutation.utils';

declare global {
  interface Promise<T> {
    /**
     * Awaits the promise synchronously.
     */
    get await(): T;
  }
}

try {
  mutateClass(
    Promise,
    definePropertiesMutation({
      await: {
        get(): any {
          throw new Error('Only works in REPL.');
        },
      },
    }),
  );
} catch {
  // Ignore if not modifiable
}
