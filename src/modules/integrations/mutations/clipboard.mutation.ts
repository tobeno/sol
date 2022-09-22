import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Clipboard } from '../../clipboard/clipboard';
import { edit } from '../editor';
import { File } from '../../storage/file';
import { StorageItem } from '../../storage/storage-item';
import { tmp } from '../../storage/tmp';

declare module '../../clipboard/clipboard' {
  interface Clipboard {
    edit(): File;

    browse(): StorageItem;

    open(app?: string): StorageItem;
  }
}

mutateClass(
  Clipboard,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this.text);
      },
    },

    browse: {
      value(): StorageItem {
        const tmpFile = tmp(this.text.ext);
        tmpFile.text = this.text;

        return tmpFile.browse();
      },
    },

    open: {
      value(app?: string): StorageItem {
        const tmpFile = tmp(this.text.ext);
        tmpFile.text = this.text;

        return tmpFile.open(app);
      },
    },
  }),
);
