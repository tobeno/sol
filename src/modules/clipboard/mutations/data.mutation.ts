import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Data } from '../../../wrappers/data';
import { getClipboard } from '../clipboard';

declare module '../../../wrappers/data' {
  interface Data {
    /**
     * Copies the data as text to the clipboard.
     */
    copy(): this;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    copy: {
      value(): any {
        getClipboard().text = String(this);

        return this;
      },
    },
  }),
);
