import { File } from '../../storage/file';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Markdown } from '../../data/markdown';
import { tmp } from '../../storage/tmp';

declare module '../../data/markdown' {
  interface Markdown {
    edit(): File;

    browse(): File;

    open(app?: string): File;
  }
}

mutateClass(
  Markdown,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this.text.value);
      },
    },

    browse: {
      value(): File {
        const tmpFile = tmp(this.text.ext);
        tmpFile.text = this.text;

        return tmpFile.browse();
      },
    },

    open: {
      value(app?: string): File {
        const tmpFile = tmp(this.text.ext);
        tmpFile.text = this.text;

        return tmpFile.open(app);
      },
    },
  }),
);
