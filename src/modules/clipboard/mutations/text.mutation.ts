import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Text } from '../../data/text';
import { getClipboard } from '../clipboard';

declare module '../../data/text' {
  interface Text {
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
