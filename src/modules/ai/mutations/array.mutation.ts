import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Data } from '../../../wrappers/data.wrapper';
import { AiConversation } from '../wrappers/ai-conversation.wrapper';

declare global {
  interface Array<T> {
    /**
     * Asks the AI a question about this array (as JSON).
     */
    ask(question: string): AiConversation;

    /**
     * Asks the AI a question about this array (as JSON).
     */
    askCode(question: string): AiConversation;
  }
}

mutateClass(
  Array,
  definePropertiesMutation({
    ask: {
      value(question: string): AiConversation {
        return Data.create(this).ask(question);
      },
    },
    askCode: {
      value(question: string): AiConversation {
        return Data.create(this).askCode(question);
      },
    },
  }),
);
