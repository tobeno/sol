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
      value(question: string): AiConversation {
        return this.json.ask(question);
      },
    },

    askCode: {
      value(question: string): AiConversation {
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

        return new AiConversation({
          messages: this.value as any,
        });
      },
    },
  }),
);
