import { parse as recastParse, print as recastPrint } from 'recast';
import { DataType } from '../../data/data-type';
import { StringTransformer } from './string.transformer';
import { Ast } from '../../data/ast';

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
