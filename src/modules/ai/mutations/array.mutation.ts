import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Data } from '../../../wrappers/data';
import { AiConversation } from '../wrappers/ai-conversation';

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
