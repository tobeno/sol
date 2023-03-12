import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { DataFormat } from '../../data/data-format';
import { Text } from '../../data/text';
import { AiConversation } from '../ai-conversation';

declare module '../../data/text' {
  interface Text {
    /**
     * Asks the AI about this text (optionally with a question as prefix).
     */
    ask(question?: string | null): AiConversation;

    /**
     * Asks the AI about this text (optionally with a question as prefix).
     */
    askCode(question?: string | null): AiConversation;
  }
}

function ask(
  target: Text,
  method: 'ask' | 'askCode',
  question: string | null = null,
): AiConversation {
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
  const conversation = new AiConversation();
  conversation[method](question);

  return conversation;
}

mutateClass(
  Text,
  definePropertiesMutation({
    ask: {
      value(question: string | null = null): any {
        return ask(this, 'ask', question);
      },
    },
    askCode: {
      value(question: string | null = null): any {
        return ask(this, 'askCode', question);
      },
    },
  }),
);
