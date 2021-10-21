import { File } from '../storage/file';
import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { edit } from './editor';
import { Text } from '../data/text';

declare module '../data/text' {
  interface Text {
    edit(): File;
  }
}

mutateClass(
  Text,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this);
      },
    },
  }),
);
