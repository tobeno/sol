import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Text } from '../../data/text';
import { File } from '../file';
import { save, saveAs } from '../save';

declare module '../../data/text' {
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
