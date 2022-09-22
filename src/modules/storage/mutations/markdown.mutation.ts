import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../file';
import { save, saveAs } from '../save';
import { Markdown } from '../../data/markdown';

declare module '../../data/markdown' {
  interface Markdown {
    saveAs(path: string): File;

    save(): File;
  }
}

mutateClass(
  Markdown,
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
