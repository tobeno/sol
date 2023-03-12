import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Data } from '../../data/data';
import { AiConversation } from '../ai-conversation';

declare module '../../data/data' {
  interface Data {
    /**
     * Asks the AI a question about this data (as JSON).
     */
    ask(question: string): AiConversation;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    ask: {
      value(question: string): AiConversation {
        const conversation = new AiConversation();
        conversation.ask(
          `${question}\n\`\`\`\n${this.json.toString()}\n\`\`\``,
        );

        return conversation;
      },
    },
  }),
);
