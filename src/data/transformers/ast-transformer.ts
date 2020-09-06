import { parse as recastParse, print as recastPrint } from 'recast';
import { DataType } from '../data-type';
import { StringTransformer } from './string-transformer';
import { parse as babelParse } from '@babel/parser';
import { Ast } from '../ast';

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

  parse(input: string) {
    return new Ast(
      recastParse(input, {
        parser: {
          parse(code: string) {
            return babelParse(code, {
              sourceType: 'module',
              plugins: ['typescript'],
            });
          },
        },
      }),
    );
  }
}
