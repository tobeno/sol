/**
 * Mutation for the global scope.
 */

import type { FromPropertyDescriptorMap } from '../../../interfaces/object.interfaces';
import { withHelp } from '../../../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation.utils';
import { askAi, askAiCode } from '../utils/ai.utils';

export const globals = {
  ask: withHelp(
    {
      value: askAi,
    },
    'Ask AI a question',
  ),
  askCode: withHelp(
    {
      value: askAiCode,
    },
    'Ask AI about code',
  ),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const ask: Globals['ask'];
  const askCode: Globals['askCode'];
}

mutateGlobals(definePropertiesMutation(globals));
