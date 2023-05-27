import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Data } from '../../../wrappers/data';
import { File } from '../../../wrappers/file';
import { save, saveAs } from '../utils/save';

declare module '../../../wrappers/data' {
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
