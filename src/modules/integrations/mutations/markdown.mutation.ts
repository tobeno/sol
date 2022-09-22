import { File } from '../../storage/file';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Markdown } from '../../data/markdown';
import { tmp } from '../../storage/tmp';
import { StorageItem } from '../../storage/storage-item';

declare module '../../data/markdown' {
  interface Markdown {
    edit(): File;

    browse(): StorageItem;

    open(app?: string): StorageItem;
  }
}

mutateClass(
  Markdown,
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
