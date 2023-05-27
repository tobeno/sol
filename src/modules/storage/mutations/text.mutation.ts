import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { File } from '../../../wrappers/file.wrapper';
import { Text } from '../../../wrappers/text.wrapper';
import { save, saveAs } from '../utils/save.utils';

declare module '../../../wrappers/text.wrapper' {
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
