import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Text } from '../../../wrappers/text.wrapper';
import { getClipboard } from '../clipboard';

declare module '../../../wrappers/text.wrapper' {
  interface Text {
    /**
     * Copies the text to the clipboard.
     */
    copy(): this;
  }
}

mutateClass(
  Text,
  definePropertiesMutation({
    copy: {
      value(): any {
        getClipboard().text = String(this);

        return this;
      },
    },
  }),
);
