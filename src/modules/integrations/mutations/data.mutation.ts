import { File } from '../../storage/file';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Data } from '../../data/data';

declare module '../../data/data' {
  interface Data {
    edit(): File;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this.value);
      },
    },
  }),
);
