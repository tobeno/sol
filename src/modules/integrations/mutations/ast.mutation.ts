import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { open } from '../../../utils/open.utils';
import { Ast } from '../../../wrappers/ast.wrapper';
import { File } from '../../../wrappers/file.wrapper';
import { edit } from '../utils/editor.utils';

declare module '../../../wrappers/ast.wrapper' {
  interface Ast {
    /**
     * Opens the AST in the default editor.
     */
    edit(): File;

    /**
     * Copies the AST to the clipboard and opens the AST explorer for pasting.
     */
    explore(): this;
  }
}

mutateClass(
  Ast,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this.json.value);
      },
    },

    explore: {
      value(): any {
        this.code.copy();

        open('https://astexplorer.net/');

        return this;
      },
    },
  }),
);
