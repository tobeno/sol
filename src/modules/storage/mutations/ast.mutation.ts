import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Ast } from '../../../wrappers/ast.wrapper';
import { File } from '../../../wrappers/file.wrapper';
import { save, saveAs } from '../utils/save.utils';

declare module '../../../wrappers/ast.wrapper' {
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
