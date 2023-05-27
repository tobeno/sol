import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../../../wrappers/file';
import { Response } from '../../../wrappers/response';
import { save, saveAs } from '../utils/save';

declare module '../../../wrappers/response' {
  interface Response {
    /**
     * Saves the response as the given file.
     */
    saveAs(path: string): File;

    /**
     * Saves the response in a file.
     */
    save(): File;
  }
}

mutateClass(
  Response,
  definePropertiesMutation({
    saveAs: {
      value(path: string): File {
        return saveAs(this.json, path);
      },
    },

    save: {
      value(): File {
        return save(this.json);
      },
    },
  }),
);
