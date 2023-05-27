import { parse as recastParse, print as recastPrint } from 'recast';
import { Ast } from '../../../wrappers/ast.wrapper';
import { DataType } from '../../../wrappers/data-type.wrapper';
import { StringTransformer } from './string.transformer';

/**
 * Transformer for converting ASTs from and to strings.
 */
export class AstTransformer extends StringTransformer<any> {
  constructor() {
    super(DataType.Ast);
  }

  stringify(input: any): string {
    if (input instanceof Ast) {
      input = input.value;
    }

    return recastPrint(input).code;
  }

  parse(input: string): Ast {
    return Ast.create(
      recastParse(input, {
        parser: {
          parse(code: string) {
            return require('@babel/parser').parse(code, {
              sourceType: 'module',
              plugins: ['typescript'],
            });
          },
        },
      }),
    );
  }
}
