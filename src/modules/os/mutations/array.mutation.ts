import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';

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
