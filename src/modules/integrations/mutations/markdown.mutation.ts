import { File } from '../../storage/file';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Markdown } from '../../data/markdown';
import { tmp } from '../../storage/tmp';

declare module '../../data/markdown' {
  interface Markdown {
    /**
     * Opens the Markdown in the default editor.
     */
    edit(): File;

    /**
     * Opens the Markdown in the default browser.
     */
    browse(): File;

    /**
     * Opens the Markdown in the default or given app.
     */
    open(app?: string): File;
  }
}

mutateClass(
  Markdown,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this.text.value);
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
