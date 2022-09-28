import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { GenericStorageItemCollection } from '../../storage/storage-item-collection';
import { getClipboard } from '../clipboard';
import { StorageItem } from '../../storage/storage-item';

declare module '../../storage/storage-item-collection' {
  interface GenericItemCollection<ItemType extends StorageItem> {
    copy(): this;
  }
}

mutateClass(
  GenericStorageItemCollection,
  definePropertiesMutation({
    copy: {
      value(): any {
        getClipboard().text = this.toString();

        return this;
      },
    },
  }),
);
