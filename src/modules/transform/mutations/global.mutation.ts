/**
 * Mutation for the global scope.
 */

import type { FromPropertyDescriptorMap } from '../../../interfaces/object.interfaces';
import { withHelp } from '../../../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation.utils';
import {
  codeToAst,
  csvToData,
  jsonToData,
  transform,
  yamlToData,
} from '../utils/transformer.utils';

export const globals = {
  ast: {
    value: withHelp(codeToAst, 'Converts code to its AST to Data'),
  },
  csv: {
    value: withHelp(csvToData, 'Converts CSV to Data'),
  },
  json: {
    value: withHelp(jsonToData, 'Converts JSON to Data'),
  },
  transform: {
    value: withHelp(
      transform,
      'Transforms data between data types using transformations',
    ),
  },
  yaml: {
    value: withHelp(yamlToData, 'Converts YAML to Data'),
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
