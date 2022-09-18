import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';
import { Text } from '../../data/text';
import { getClipboard } from '../clipboard';

declare module '../../data/text' {
  interface Text {
    copy(): void;
  }
}

mutateClass(
  Text,
  definePropertiesMutation({
    copy: {
      value(): void {
        getClipboard().text = String(this);
      },
    },
  }),
);
