import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { StorageItem } from '../../../wrappers/storage-item.wrapper';
import { getClipboard } from '../clipboard';

declare module '../../../wrappers/storage-item.wrapper' {
  interface StorageItem {
    /**
     * Copies the storage item path to the clipboard.
     */
    copy(): this;
  }
}

mutateClass(
  StorageItem,
  definePropertiesMutation({
    copy: {
      value(): any {
        getClipboard().text = String(this);

        return this;
      },
    },
  }),
);
