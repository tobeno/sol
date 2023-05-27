import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Data } from '../../../wrappers/data';
import { File } from '../../../wrappers/file';
import { edit } from '../utils/editor';

declare module '../../../wrappers/data' {
  interface Data {
    /**
     * Opens the data in the default editor.
     */
    edit(): File;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this.value);
      },
    },
  }),
);
