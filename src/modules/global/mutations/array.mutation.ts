import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';

declare global {
  interface Array<T> {
    get unique(): T[];
  }
}

mutateClass(
  Array,
  definePropertiesMutation({
    unique: {
      get(): any[] {
        return [...new Set(this)];
      },
    },
  }),
);
