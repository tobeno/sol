import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../file';
import { save, saveAs } from '../save';
import { Response } from '../../web/response';

declare module '../../web/response' {
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
