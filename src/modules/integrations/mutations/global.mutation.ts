/**
 * Mutation for the global scope.
 */

import type { FromPropertyDescriptorMap } from '../../../interfaces/object.interfaces';
import { withHelp } from '../../../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation.utils';
import { browse } from '../utils/browser.utils';
import { edit } from '../utils/editor.utils';

export const globals = {
  browse: {
    value: withHelp(
      browse,
      `
Opens the given URL in the browser.

Usage:
> browse('https://google.com')
    `,
    ),
  },
  edit: {
    value: withHelp(
      edit,
      `
Opens a file for editing (defaults to code as editor).

Usage:
> edit('README.md')
      `,
    ),
  },
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const browse: Globals['browse'];
  const edit: Globals['edit'];
}

mutateGlobals(definePropertiesMutation(globals));
