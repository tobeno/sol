import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Clipboard } from '../../clipboard/clipboard';
import { edit } from '../editor';
import { File } from '../../storage/file';
import { tmp } from '../../storage/tmp';

declare module '../../clipboard/clipboard' {
  interface Clipboard {
    edit(): File;

    browse(): File;

    open(app?: string): File;
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
      value(): File {
        const tmpFile = tmp(this.text.ext);
        tmpFile.text = this.text;

        return tmpFile.browse();
      },
    },

    open: {
      value(app?: string): File {
        const tmpFile = tmp(this.text.ext);
        tmpFile.text = this.text;

        return tmpFile.open(app);
      },
    },
  }),
);
