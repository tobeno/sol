import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { StorageItem } from '../../storage/storage-item';
import { getClipboard } from '../clipboard';

declare module '../../storage/storage-item' {
  interface StorageItem {
    copy(): void;
  }
}

mutateClass(
  StorageItem,
  definePropertiesMutation({
    copy: {
      value(): void {
        getClipboard().text = String(this);
      },
    },
  }),
);
