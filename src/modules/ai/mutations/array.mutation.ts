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
    ask(question: string): Promise<AiConversation>;

    /**
     * Asks the AI a question about this array (as JSON).
     */
    askCode(question: string): Promise<AiConversation>;
  }
}

mutateClass(
  Array,
  definePropertiesMutation({
    ask: {
      async value(question: string): Promise<AiConversation> {
        return Data.create(this).ask(question);
      },
    },
    askCode: {
      async value(question: string): Promise<AiConversation> {
        return Data.create(this).askCode(question);
      },
    },
  }),
);
