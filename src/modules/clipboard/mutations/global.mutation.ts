/**
 * Mutation for the global scope.
 */

import { FromPropertyDescriptorMap } from '../../../interfaces/object';
import { withHelp } from '../../../utils/metadata';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation';
import { getClipboard } from '../../clipboard/clipboard';

export const globals = {
  clipboard: withHelp(
    {
      get() {
        return getClipboard();
      },
    },
    'Exposes the system clipboard',
  ),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const clipboard: Globals['clipboard'];
}

mutateGlobals(definePropertiesMutation(globals));
