import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../../storage/file';
import { Image } from '../image';

declare module '../../storage/file' {
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
