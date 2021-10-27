import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { Item } from '../storage/item';
import { getClipboard } from './clipboard';

declare module '../storage/item' {
  interface Item {
    copy(): void;
  }
}

mutateClass(
  Item,
  definePropertiesMutation({
    copy: {
      value(): void {
        getClipboard().text = String(this);
      },
    },
  }),
);
