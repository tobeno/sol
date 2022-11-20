import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../file';
import { save, saveAs } from '../save';
import { Ast } from '../../data/ast';

declare module '../../data/ast' {
  interface Ast {
    /**
     * Saves the AST as the given file.
     */
    saveAs(path: string): File;

    /**
     * Saves the AST in a file.
     */
    save(): File;
  }
}

mutateClass(
  Ast,
  definePropertiesMutation({
    saveAs: {
      value(path: string): File {
        return saveAs(this.code, path);
      },
    },

    save: {
      value(): File {
        return save(this.code);
      },
    },
  }),
);
