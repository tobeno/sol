import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { File } from '../../../wrappers/file.wrapper';
import { Image } from '../wrappers/image.wrapper';

declare module '../../../wrappers/file.wrapper' {
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
