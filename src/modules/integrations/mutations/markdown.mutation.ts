import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { File } from '../../../wrappers/file.wrapper';
import { Markdown } from '../../../wrappers/markdown.wrapper';
import { TmpFile } from '../../../wrappers/tmp-file.wrapper';
import { edit } from '../utils/editor.utils';

declare module '../../../wrappers/markdown.wrapper' {
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
