import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../../../wrappers/file';
import { Text } from '../../../wrappers/text';
import { save, saveAs } from '../utils/save';

declare module '../../../wrappers/text' {
  interface Text {
    /**
     * Saves the text as the given file.
     */
    saveAs(path: string): File;

    /**
     * Saves the text in a file.
     */
    save(): File;
  }
}

mutateClass(
  Text,
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
