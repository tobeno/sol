import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';
import { GenericStorageItemCollection } from '../../storage/storage-item-collection';
import { getClipboard } from '../clipboard';
import { StorageItem } from '../../storage/storage-item';

declare module '../../storage/storage-item-collection' {
  interface GenericItemCollection<ItemType extends StorageItem> {
    copy(): void;
  }
}

mutateClass(
  GenericStorageItemCollection,
  definePropertiesMutation({
    copy: {
      value(): void {
        getClipboard().text = this.toString();
      },
    },
  }),
);
