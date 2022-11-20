import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { getClipboard } from '../clipboard';
import { Ast } from '../../data/ast';

declare module '../../data/ast' {
  interface Ast {
    /**
     * Copies the AST JSON to the clipboard.
     */
    copy(): this;
  }
}

mutateClass(
  Ast,
  definePropertiesMutation({
    copy: {
      value(): any {
        getClipboard().text = String(this.json);

        return this;
      },
    },
  }),
);
