import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';

declare global {
  interface Array<T> {
    copy(): this;
  }
}

mutateClass(
  Array,
  definePropertiesMutation({
    copy: {
      value(): any {
        this.json.copy();

        return this;
      },
    },
  }),
);
