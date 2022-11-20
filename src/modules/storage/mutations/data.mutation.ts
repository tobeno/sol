import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Data } from '../../data/data';
import { File } from '../file';
import { save, saveAs } from '../save';

declare module '../../data/data' {
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
