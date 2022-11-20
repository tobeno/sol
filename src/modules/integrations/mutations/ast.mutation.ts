import { File } from '../../storage/file';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Ast } from '../../data/ast';
import { open } from '../open';

declare module '../../data/ast' {
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
