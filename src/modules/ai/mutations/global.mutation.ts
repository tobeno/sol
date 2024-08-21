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
import { AiConversation } from '../wrappers/ai-conversation.wrapper';

export const globals = {
  aiConversation: {
    value: withHelp(
      AiConversation.create,
      `
Creates a wrapper for an AI conversation.

Usage:
${AiConversation.usageHelp}
    `,
    ),
  },
  ask: {
    value: withHelp(
      askAi,
      `
Ask AI a question.

Usage:
> ask('What is the meaning of life?').await.answer
> ask('What is the meaning of life?').await.ask('Summarize this in a few words.').await.answer
`,
    ),
  },
  askCode: {
    value: withHelp(
      askAiCode,
      `
Ask AI about code.

Usage:
> askCode('Log "test" to console in JavaScript').await.answer
`,
    ),
  },
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const aiConversation: Globals['aiConversation'];
  const ask: Globals['ask'];
  const askCode: Globals['askCode'];
}

mutateGlobals(definePropertiesMutation(globals));
