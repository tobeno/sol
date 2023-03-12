import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Data } from '../../data/data';
import { AiConversation } from '../ai-conversation';

declare module '../../data/data' {
  interface Data {
    /**
     * Asks the AI a question about this data (as JSON).
     */
    ask(question: string): AiConversation;

    /**
     * Asks the AI a question about this data (as JSON).
     */
    askCode(question: string): AiConversation;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    ask: {
      value(question: string): AiConversation {
        return this.json.ask(question);
      },
    },

    askCode: {
      value(question: string): AiConversation {
        return this.json.askCode(question);
      },
    },
  }),
);
