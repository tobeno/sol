import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../../../wrappers/file';
import { Image } from '../wrappers/image';

declare module '../../../wrappers/file' {
  interface File {
    /**
     * Loads the file contents as Image.
     */
    get image(): Image;

    /**
     * Sets the data as Image in the file.
     */
    set image(value: Image);
  }
}

mutateClass(
  File,
  definePropertiesMutation({
    image: {
      get(): Image {
        return Image.create(this.buffer);
      },
      set(value: Image) {
        this.buffer = awaitSync(value.buffer);
      },
    },
  }),
);
