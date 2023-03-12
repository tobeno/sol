import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Text } from '../../data/text';
import { AiConversation } from '../ai-conversation';

declare module '../../data/text' {
  interface Text {
    /**
     * Asks the AI about this text (optionally with a question as prefix).
     */
    ask(question?: string | null): AiConversation;
  }
}

mutateClass(
  Text,
  definePropertiesMutation({
    ask: {
      value(question: string | null = null): any {
        question = (question || '') + (question ? '\n' : '') + this.toString();
        const conversation = new AiConversation();
        conversation.ask(question);

        return conversation;
      },
    },
  }),
);
