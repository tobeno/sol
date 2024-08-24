/**
 * Mutation for the global scope.
 */

import type { FromPropertyDescriptorMap } from '../../../interfaces/object.interfaces';
import { withHelp } from '../../../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation.utils';
import { Ast } from '../../../wrappers/ast.wrapper';
import {
  codeToAst,
  csvToData,
  jsonToData,
  transform,
  yamlToData,
} from '../utils/transformer.utils';

export const globals = {
  ast: {
    value: withHelp(
      codeToAst,
      `
Converts code to its AST to Data.

Usage:
${Ast.usageHelp} 
   `,
    ),
  },
  csv: {
    value: withHelp(
      csvToData,
      `
Converts CSV to Data.

Usage:
> csv('a,b,c\n1,2,3\n4,5,6').map(row => row.a)).joined
    `,
    ),
  },
  json: {
    value: withHelp(
      jsonToData,
      `
Converts JSON to Data.

Usage:
> json('{ a: 1, b: 2 }').get('a')
    `,
    ),
  },
  transform: {
    value: withHelp(
      transform,
      `
Transforms data between data types using transformations.

Usage:
> transform('{"a": 1}', 'string<application/json>:Data').get('a')
> transform({ a: 1 }, 'object:Text<application/json>').uppercased.json.get('A')
      `,
    ),
  },
  yaml: {
    value: withHelp(
      yamlToData,
      `
Converts YAML to Data.

Usage:
> yaml('a: 1\nb: 2').get('a')
    `,
    ),
  },
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const ast: Globals['ast'];
  const csv: Globals['csv'];
  const json: Globals['json'];
  const transform: Globals['transform'];
  const yaml: Globals['yaml'];
}

mutateGlobals(definePropertiesMutation(globals));
