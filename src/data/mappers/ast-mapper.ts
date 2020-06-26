import { parse as recastParse, print as recastPrint } from 'recast';
import { DataType } from '../data-type';
import { StringMapper } from './string-mapper';
import { parse as babelParse } from '@babel/parser';
import { Ast } from '../ast';

export class AstMapper extends StringMapper<any> {
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
