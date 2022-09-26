import { File } from '../../storage/file';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Ast } from '../../data/ast';

declare module '../../data/ast' {
  interface Ast {
    edit(): File;
  }
}

mutateClass(
  Ast,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this.json);
      },
    },
  }),
);
