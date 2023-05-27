import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Text } from '../../../wrappers/text';
import { getClipboard } from '../clipboard';

declare module '../../../wrappers/text' {
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
