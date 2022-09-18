import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';
import { Extension } from '../../sol/extension';
import { StorageItem } from '../../storage/storage-item';

declare module '../../sol/extension' {
  interface Extension {
    edit(): StorageItem;
  }
}

mutateClass(
  Extension,
  definePropertiesMutation({
    edit: {
      value(): StorageItem {
        this.prepare();

        return this.dir.edit();
      },
    },
  }),
);
