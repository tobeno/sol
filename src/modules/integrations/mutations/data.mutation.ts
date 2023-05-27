import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Data } from '../../../wrappers/data.wrapper';
import { File } from '../../../wrappers/file.wrapper';
import { edit } from '../utils/editor.utils';

declare module '../../../wrappers/data.wrapper' {
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
