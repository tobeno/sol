import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { File } from '../../../wrappers/file.wrapper';
import { Clipboard } from '../../clipboard/clipboard';
import { saveAs } from '../utils/save.utils';

declare module '../../clipboard/clipboard' {
  interface Clipboard {
    /**
     * Saves the clipboard contents as the given file.
     */
    saveAs(path: string): File;

    /**
     * Saves the clipboard contents in a file.
     */
    save(): File;
  }
}

mutateClass(
  Clipboard,
  definePropertiesMutation({
    saveAs: {
      value(path: string): File {
        return saveAs(this, path);
      },
    },
  }),
);
