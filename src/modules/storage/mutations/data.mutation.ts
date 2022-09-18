import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';
import { Data } from '../../data/data';
import { File } from '../file';
import { save, saveAs } from '../save';

declare module '../../data/data' {
  interface Data {
    saveAs(path: string): File;

    save(): File;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    saveAs: {
      value(path: string): File {
        return saveAs(this, path);
      },
    },

    save: {
      value(): File {
        return save(this);
      },
    },
  }),
);
