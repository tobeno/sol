import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';

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
