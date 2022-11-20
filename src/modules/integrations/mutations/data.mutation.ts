import { File } from '../../storage/file';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Data } from '../../data/data';

declare module '../../data/data' {
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
