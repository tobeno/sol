import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../../../wrappers/file';
import { TmpFile } from '../../../wrappers/tmp-file';
import { Clipboard } from '../../clipboard/clipboard';
import { edit } from '../utils/editor';

declare module '../../clipboard/clipboard' {
  interface Clipboard {
    /**
     * Opens the clipboard contents in the default editor.
     */
    edit(): File;

    /**
     * Opens the clipboard contents in the default browser.
     */
    browse(): File;

    /**
     * Opens the clipboard contents in the default or given app.
     */
    open(app?: string): File;
  }
}

mutateClass(
  Clipboard,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this.text.value);
      },
    },

    browse: {
      value(): File {
        const tmpFile = TmpFile.create(this.text.ext);
        tmpFile.text = this.text;

        return tmpFile.browse();
      },
    },

    open: {
      value(app?: string): File {
        const tmpFile = TmpFile.create(this.text.ext);
        tmpFile.text = this.text;

        return tmpFile.open(app);
      },
    },
  }),
);
