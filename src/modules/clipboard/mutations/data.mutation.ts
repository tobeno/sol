import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Data } from '../../../wrappers/data.wrapper';
import { getClipboard } from '../clipboard';

declare module '../../../wrappers/data.wrapper' {
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
