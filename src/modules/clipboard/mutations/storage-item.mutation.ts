import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { StorageItem } from '../../storage/storage-item';
import { getClipboard } from '../clipboard';

declare module '../../storage/storage-item' {
  interface StorageItem {
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
