/**
 * Mutation for the global scope.
 */

import type { FromPropertyDescriptorMap } from '../../../interfaces/object.interfaces';
import { withHelp } from '../../../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation.utils';
import { Clipboard, getClipboard } from '../../clipboard/clipboard';

export const globals = {
  clipboard: {
    get() {
      return withHelp(
        getClipboard(),
        `
Exposes the system clipboard.

Usage:
${Clipboard.usageHelp}
`,
      );
    },
  },
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const clipboard: Globals['clipboard'];
}

mutateGlobals(definePropertiesMutation(globals));
