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
import { Buffer } from 'node:buffer';

export const globals = {
  image: {
    value(imageOrFile: Image | Buffer | File | string): Image {
      let result: Image;
      if (imageOrFile instanceof Buffer || imageOrFile instanceof Image) {
        result = Image.create(imageOrFile);
      } else {
        result = File.create(imageOrFile as string).image;
      }

      return withHelp(
        result,
        `
Creates an Image wrapper for the given image path, buffer or file.

Usage:
${Image.usageHelp}
        `,
      );
    },
  },
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const image: Globals['image'];
}

mutateGlobals(definePropertiesMutation(globals));
