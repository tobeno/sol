import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { Text } from '../data/text';
import { clipboard } from './clipboard';

declare module '../data/text' {
  interface Text {
    copy(): void;
  }
}

mutateClass(
  Text,
  definePropertiesMutation({
    copy: {
      value(): void {
        clipboard.text = String(this);
      },
    },
  }),
);
