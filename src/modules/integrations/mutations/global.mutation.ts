/**
 * Mutation for the global scope.
 */

import { FromPropertyDescriptorMap } from '../../../interfaces/object';
import { withHelp } from '../../../utils/metadata';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation';
import { browse } from '../utils/browser';
import { edit } from '../utils/editor';

export const globals = {
  browse: withHelp(
    {
      value: browse,
    },
    'Opens the given URL in the browser',
  ),
  edit: withHelp(
    {
      value: edit,
    },
    'Opens a file for editing (defaults to code as editor)',
  ),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const browse: Globals['browse'];
  const edit: Globals['edit'];
}

mutateGlobals(definePropertiesMutation(globals));
