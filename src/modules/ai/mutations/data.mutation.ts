import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Data } from '../../../wrappers/data.wrapper';
import { AiConversation } from '../wrappers/ai-conversation.wrapper';

declare module '../../../wrappers/data.wrapper' {
  interface Data {
    /**
     * Asks the AI a question about this data (as JSON).
     */
    ask(question: string): Promise<AiConversation>;

    /**
     * Asks the AI a question about this data (as JSON).
     */
    askCode(question: string): Promise<AiConversation>;

    /**
     * Creates a conversation from this data.
     *
     * This can be used to convert JSON conversation data back to a conversation.
     *
     * Example: file('.local/ai-conversation.json').json.conversation.ask('How are you?');
     */
    conversation: AiConversation;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    ask: {
      async value(question: string): Promise<AiConversation> {
        return this.json.ask(question);
      },
    },

    askCode: {
      async value(question: string): Promise<AiConversation> {
        return this.json.askCode(question);
      },
    },

    conversation: {
      get(): AiConversation {
        if (
          !Array.isArray(this.value) ||
          (this.value.length && !('role' in this.value[0]))
        ) {
          throw new Error('Cannot create a conversation from this data.');
        }

        return AiConversation.create({
          messages: this.value as any,
        });
      },
    },
  }),
);
