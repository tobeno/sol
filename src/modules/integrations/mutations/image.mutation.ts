import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../../../wrappers/file';
import { TmpFile } from '../../../wrappers/tmp-file';
import { Image } from '../../image/wrappers/image';

declare module '../../image/wrappers/image' {
  interface Image {
    /**
     * Opens the Image in the default browser.
     */
    browse(): File;

    /**
     * Opens the Image in the default or given app.
     */
    open(app?: string): File;
  }
}

mutateClass(
  Image,
  definePropertiesMutation({
    browse: {
      value(): File {
        const tmpFile = TmpFile.create();
        tmpFile.buffer = this.buffer;

        return tmpFile.browse();
      },
    },

    open: {
      value(app?: string): File {
        const tmpFile = TmpFile.create();
        tmpFile.buffer = this.buffer;

        return tmpFile.open(app);
      },
    },
  }),
);
