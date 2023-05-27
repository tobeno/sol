import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../../../wrappers/file';
import { Markdown } from '../../../wrappers/markdown';
import { save, saveAs } from '../utils/save';

declare module '../../../wrappers/markdown' {
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
