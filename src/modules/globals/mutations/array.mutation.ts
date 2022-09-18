import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';

declare global {
  interface Array<T> {
    get unique(): Array<T>;
  }
}

mutateClass(
  Array,
  definePropertiesMutation({
    unique: {
      get() {
        return [...new Set(this)];
      },
    },
  }),
);
