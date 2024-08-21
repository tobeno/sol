import { AiConversation } from '../wrappers/ai-conversation.wrapper';

export async function askAi(question: string): Promise<AiConversation> {
  return AiConversation.create().ask(question);
}

export async function askAiCode(question: string): Promise<AiConversation> {
  return AiConversation.create().askCode(question);
}
