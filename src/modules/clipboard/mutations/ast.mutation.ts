import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Ast } from '../../../wrappers/ast.wrapper';
import { getClipboard } from '../clipboard';

declare module '../../../wrappers/ast.wrapper' {
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
