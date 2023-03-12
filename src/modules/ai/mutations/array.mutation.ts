import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Data } from '../../data/data';
import { AiConversation } from '../ai-conversation';

declare global {
  interface Array<T> {
    /**
     * Asks the AI a question about this array (as JSON).
     */
    ask(question: string): AiConversation;
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
  }),
);
