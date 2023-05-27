import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Data } from '../../../wrappers/data.wrapper';
import { File } from '../../../wrappers/file.wrapper';
import { save, saveAs } from '../utils/save.utils';

declare module '../../../wrappers/data.wrapper' {
  interface Data {
    /**
     * Saves the data as the given file.
     */
    saveAs(path: string): File;

    /**
     * Saves the data in a file.
     */
    save(): File;
  }
}

mutateClass(
  Data,
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
