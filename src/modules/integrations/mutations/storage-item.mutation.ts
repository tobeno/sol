import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { StorageItem } from '../../storage/storage-item';
import { browse } from '../browser';
import { open } from '../../../utils/open';

declare module '../../storage/storage-item' {
  interface StorageItem {
    /**
     * Opens the item in the default editor.
     */
    edit(): this;

    /**
     * Opens the item in the default browser.
     */
    browse(): this;

    /**
     * Opens the item in the default or given app.
     */
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
