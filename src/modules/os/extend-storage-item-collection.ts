import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { GenericItemCollection } from '../storage/item-collection';
import { clipboard } from './clipboard';
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
        clipboard.text = this.toString();
      },
    },
  }),
);
