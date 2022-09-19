import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../file';
import { saveAs } from '../save';
import { Clipboard } from '../../os/clipboard';

declare module '../../os/clipboard' {
  interface Clipboard {
    saveAs(path: string): File;

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
