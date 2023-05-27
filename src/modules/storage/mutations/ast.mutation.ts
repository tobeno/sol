import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Ast } from '../../../wrappers/ast';
import { File } from '../../../wrappers/file';
import { save, saveAs } from '../utils/save';

declare module '../../../wrappers/ast' {
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
