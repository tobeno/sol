import { AiConversation } from '../wrappers/ai-conversation';

export function askAi(question: string): AiConversation {
  return new AiConversation().ask(question);
}

export function askAiCode(question: string): AiConversation {
  return new AiConversation().askCode(question);
}
