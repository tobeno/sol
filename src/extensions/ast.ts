import { ast } from '../data/fn';
import { Ast } from '../data/ast';
import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';

export function WithAst<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    get ast() {
      return ast(this.text);
    }

    set ast(value: Ast) {
      this.text = value.code;
    }

    async updateAst(
      updater: (value: Ast) => Ast | Promise<Ast>,
    ): Promise<void> {
      const updated = await updater(this.ast);
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.ast = updated;
    }

    async showAst(formatter?: (ast: Ast) => any | Promise<any>): Promise<void> {
      let ast = this.ast;
      if (formatter) {
        ast = await formatter(ast);
      }

      console.log(ast);
    }
  };
}
