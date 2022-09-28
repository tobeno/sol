import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { StorageItem } from '../../storage/storage-item';
import { browse } from '../browser';
import { open } from '../open';

declare module '../../storage/storage-item' {
  interface StorageItem {
    edit(): this;

    browse(): this;

    open(app?: string): this;
  }
}

mutateClass(
  StorageItem,
  definePropertiesMutation({
    edit: {
      value(): any {
        open(this.uri, process.env.SOL_EDITOR || 'code');

        return this;
      },
    },
    browse: {
      value(): any {
        browse(this.uri);

        return this;
      },
    },
    open: {
      value(app?: string): any {
        open(this.uri, app);

        return this;
      },
    },
  }),
);
