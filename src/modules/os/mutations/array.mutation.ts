import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';

declare global {
  interface Array<T> {
    copy(): void;
  }
}

mutateClass(
  Array,
  definePropertiesMutation({
    copy: {
      value(): void {
        this.json.copy();
      },
    },
  }),
);