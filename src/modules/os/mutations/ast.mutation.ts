import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { getClipboard } from '../clipboard';
import { Ast } from '../../data/ast';

declare module '../../data/ast' {
  interface Ast {
    copy(): void;
  }
}

mutateClass(
  Ast,
  definePropertiesMutation({
    copy: {
      value(): void {
        getClipboard().text = String(this.json);
      },
    },
  }),
);
