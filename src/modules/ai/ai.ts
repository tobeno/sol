import { AiConversation } from './ai-conversation';

/**
 * Class for interacting with the OS clipboard.
 */
export class Ai {
  ask(question: string): AiConversation {
    return new AiConversation().ask(question);
  }
}

let ai: Ai | null = null;

export function getAi(): Ai {
  if (!ai) {
    ai = new Ai();
  }

  return ai;
}
