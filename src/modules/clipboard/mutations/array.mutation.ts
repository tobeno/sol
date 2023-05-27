import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';

declare global {
  interface Array<T> {
    /**
     * Copies the array to the clipboard.
     */
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
