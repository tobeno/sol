import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Ast } from '../../../wrappers/ast';
import { getClipboard } from '../clipboard';

declare module '../../../wrappers/ast' {
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
