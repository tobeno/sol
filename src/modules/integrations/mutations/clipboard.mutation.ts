import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Clipboard } from '../../os/clipboard';
import { edit } from '../editor';
import { File } from '../../storage/file';

declare module '../../os/clipboard' {
  interface Clipboard {
    edit(): File;
  }
}

mutateClass(
  Clipboard,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this.text);
      },
    },
  }),
);
