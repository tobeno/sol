/**
 * Mutation for the global scope.
 */
import type { FromPropertyDescriptorMap } from '../../../interfaces/object.interfaces';
import { withHelp } from '../../../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation.utils';
import { File } from '../../../wrappers/file.wrapper';
import { Image } from '../wrappers/image.wrapper';

export const globals = {
  image: withHelp(
    {
      value(imageOrFile: Image | Buffer | File | string): Image {
        if (imageOrFile instanceof Buffer || imageOrFile instanceof Image) {
          return Image.create(imageOrFile);
        }

        return File.create(imageOrFile).image;
      },
    },
    'Wraps the given image file as Image',
  ),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const image: Globals['image'];
}

mutateGlobals(definePropertiesMutation(globals));
