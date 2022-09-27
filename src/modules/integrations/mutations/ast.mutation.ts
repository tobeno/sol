import { File } from '../../storage/file';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Ast } from '../../data/ast';
import { open } from '../open';

declare module '../../data/ast' {
  interface Ast {
    edit(): File;

    explore(): Ast;
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

    explore: {
      value(): Ast {
        this.code.copy();

        open('https://astexplorer.net/');

        return this;
      },
    },
  }),
);
