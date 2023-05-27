import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { File } from '../../../wrappers/file.wrapper';
import { Response } from '../../../wrappers/response.wrapper';
import { save, saveAs } from '../utils/save.utils';

declare module '../../../wrappers/response.wrapper' {
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
