import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { StorageItem } from '../../../wrappers/storage-item.wrapper';
import { GenericStorageItemCollection } from '../../../wrappers/storage-item-collection.wrapper';
import { getClipboard } from '../clipboard';

declare module '../../../wrappers/storage-item-collection.wrapper' {
  interface GenericItemCollection<ItemType extends StorageItem> {
    /**
     * Copies the paths of the collection to the clipboard.
     */
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
