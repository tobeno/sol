import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { getClipboard } from '../clipboard';
import { Ast } from '../../data/ast';

declare module '../../data/ast' {
  interface Ast {
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
