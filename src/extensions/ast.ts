import { Ast, ast } from '../data/ast';
import { Constructor } from '../interfaces/util';
import { ClassWithText } from '../interfaces/base';
import { awaitSync } from '../utils/async';

export function WithAst<T extends Constructor<ClassWithText>>(base: T) {
  return class Wrapped extends base {
    get ast() {
      return ast(this.text);
    }

    set ast(value: Ast) {
      this.text = value.code;
    }

    updateAst(updater: (value: Ast) => Ast | Promise<Ast>) {
      const updated = awaitSync(updater(this.ast));
      if (typeof updated === 'undefined') {
        throw new Error('Return value missing from updater');
      }

      this.ast = updated;
    }

    showAst(formatter?: (ast: Ast) => any | Promise<any>) {
      let ast = this.ast;
      if (formatter) {
        ast = awaitSync(formatter(ast));
      }

      console.log(ast);
    }
  };
}
