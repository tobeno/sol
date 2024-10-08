import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { DataFormat } from '../../../wrappers/data-format.wrapper';
import { Text } from '../../../wrappers/text.wrapper';
import { AiConversation } from '../wrappers/ai-conversation.wrapper';

declare module '../../../wrappers/text.wrapper' {
  interface Text {
    /**
     * Asks the AI about this text (optionally with a question as prefix).
     */
    ask(question?: string | null): Promise<AiConversation>;

    /**
     * Asks the AI about this text (optionally with a question as prefix).
     */
    askCode(question?: string | null): Promise<AiConversation>;
  }
}

async function ask(
  target: Text,
  method: 'ask' | 'askCode',
  question: string | null = null,
): Promise<AiConversation> {
  let text = target.toString();
  const { format } = target;
  if (format) {
    let language: string | null = null;
    if (format === DataFormat.Json) {
      language = 'json';
    } else if (format === DataFormat.Xml) {
      language = 'xml';
    } else if (format === DataFormat.Yaml) {
      language = 'yaml';
    } else if (format === DataFormat.Csv) {
      language = 'csv';
    } else if (format === DataFormat.Html) {
      language = 'html';
    } else if (format === DataFormat.Markdown) {
      language = 'markdown';
    }

    if (language) {
      text = `\`\`\`${language}\n${text}\n\`\`\``;
    }
  }

  question = (question || '') + (question ? '\n' : '') + text;
  const conversation = AiConversation.create();
  await conversation[method](question);

  return conversation;
}

mutateClass(
  Text,
  definePropertiesMutation({
    ask: {
      async value(question: string | null = null): Promise<any> {
        return ask(this, 'ask', question);
      },
    },
    askCode: {
      async value(question: string | null = null): Promise<any> {
        return ask(this, 'askCode', question);
      },
    },
  }),
);
