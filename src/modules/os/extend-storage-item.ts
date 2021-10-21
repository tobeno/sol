import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { Item } from '../storage/item';
import { clipboard } from './clipboard';

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
        clipboard.text = String(this);
      },
    },
  }),
);
