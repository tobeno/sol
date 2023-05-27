import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { File } from '../../../wrappers/file.wrapper';
import { Markdown } from '../../../wrappers/markdown.wrapper';
import { save, saveAs } from '../utils/save.utils';

declare module '../../../wrappers/markdown.wrapper' {
  interface Markdown {
    /**
     * Saves the Markdown as the given file.
     */
    saveAs(path: string): File;

    /**
     * Saves the Markdown in a file.
     */
    save(): File;
  }
}

mutateClass(
  Markdown,
  definePropertiesMutation({
    saveAs: {
      value(path: string): File {
        return saveAs(this, path);
      },
    },

    save: {
      value(): File {
        return save(this);
      },
    },
  }),
);
