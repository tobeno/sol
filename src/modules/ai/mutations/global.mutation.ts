/**
 * Mutation for the global scope.
 */

import { FromPropertyDescriptorMap } from '../../../interfaces/object';
import { withHelp } from '../../../utils/metadata';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation';
import { askAi, askAiCode } from '../utils/ai';

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
  const ai: Globals['ai'];
}

mutateGlobals(definePropertiesMutation(globals));
