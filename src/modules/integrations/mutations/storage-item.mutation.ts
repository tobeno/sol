import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { StorageItem } from '../../storage/storage-item';
import { browse } from '../browser';
import { open } from '../open';

declare module '../../storage/storage-item' {
  interface StorageItem {
    edit(): StorageItem;

    browse(): StorageItem;

    open(app?: string): StorageItem;
  }
}

mutateClass(
  StorageItem,
  definePropertiesMutation({
    edit: {
      value(): StorageItem {
        open(this.uri, process.env.SOL_EDITOR || 'code');

        return this;
      },
    },
    browse: {
      value(): StorageItem {
        browse(this.uri);

        return this;
      },
    },
    open: {
      value(app?: string): StorageItem {
        open(this.uri, app);

        return this;
      },
    },
  }),
);
