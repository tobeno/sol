import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { open } from '../../../utils/open';
import { Ast } from '../../../wrappers/ast';
import { File } from '../../../wrappers/file';
import { edit } from '../utils/editor';

declare module '../../../wrappers/ast' {
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
