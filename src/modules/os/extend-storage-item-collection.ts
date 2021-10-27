import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { GenericItemCollection } from '../storage/item-collection';
import { getClipboard } from './clipboard';
import { Item } from '../storage/item';

declare module '../storage/item-collection' {
  interface GenericItemCollection<ItemType extends Item> {
    copy(): void;
  }
}

mutateClass(
  GenericItemCollection,
  definePropertiesMutation({
    copy: {
      value(): void {
        getClipboard().text = this.toString();
      },
    },
  }),
);
