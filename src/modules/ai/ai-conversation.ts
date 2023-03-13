import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from 'openai';
import { inspect } from 'util';
import { createOpenAiChatCompletion, isOpenAiApiAvailable } from './open-ai';
import { createHash } from 'crypto';
import { Data } from '../data/data';
import { Text } from '../data/text';
import { DataFormat } from '../data/data-format';
import { open } from '../integrations/open';
import { getClipboard } from '../clipboard/clipboard';

export class AiConversation {
  private readonly messagesInternal: ChatCompletionRequestMessage[] = [];
  usage = {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  };

  constructor(
    private options: {
      messages?: ChatCompletionRequestMessage[];
      dryRun?: boolean;
    } = {},
  ) {
    let { messages = [] } = options;
    if (!messages.some((message) => message.role === 'system')) {
      messages = [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        ...messages,
      ];
    }

    this.messagesInternal = messages;
  }

  /**
   * Returns a MD5 has of the conversation.
   */
  get hash(): string {
    const content = JSON.stringify(this.messagesInternal);

    return createHash('md5').update(content).digest('hex');
  }

  get messages(): Data<ChatCompletionRequestMessage[]> {
    return Data.create(this.messagesInternal);
  }

  get answers(): Data<Text[]> {
    return Data.create(
      this.messagesInternal
        .filter((message) => message.role === 'assistant')
        .map((message) => Text.create(message.content)),
    );
  }

  get answer(): Text | null {
    return (this.answers.get(-1) as Text) || null;
  }

  get answerCode(): Text | null {
    return AiConversation.extractCode(this.answer);
  }

  get questions(): Data<Text[]> {
    return Data.create(
      this.messagesInternal
        .filter((message) => message.role === 'user')
        .map((message) => Text.create(message.content)),
    );
  }

  get question(): Text | null {
    return (this.questions.get(-1) as Text) || null;
  }

  get questionCode(): Text | null {
    return AiConversation.extractCode(this.question);
  }

  ask(question: string): this {
    const { dryRun } = this.options;
    if (!isOpenAiApiAvailable() && !dryRun) {
      getClipboard().text = question;
      open('http://chat.openai.com');
      return this;
    }

    this.messagesInternal.push({
      role: 'user',
      content: question,
    });

    let answer: string | null = null;
    if (!dryRun) {
      const cacheFile = solUserWorkspace.cacheDir.file(
        `ai-conversation-response-${this.hash}.json`,
      );

      let response: CreateChatCompletionResponse;
      if (!cacheFile.exists) {
        response = createOpenAiChatCompletion({
          messages: this.messagesInternal,
        });

        cacheFile.json = response;
      } else {
        response = cacheFile.json.value;
      }

      answer = response.choices[0].message?.content || null;
      if (!answer) {
        throw new Error(`No answer received.

Response: ${JSON.stringify(response, null, 2)}`);
      }

      this.usage.promptTokens += response.usage?.prompt_tokens || 0;
      this.usage.completionTokens += response.usage?.completion_tokens || 0;
      this.usage.totalTokens += response.usage?.total_tokens || 0;
    } else {
      answer = 'This is a dry run';
    }

    this.messagesInternal.push({
      role: 'assistant',
      content: answer,
    });

    return this;
  }

  askCode(question: string): this {
    return this.ask(`${question}\nONLY CODE, NOTHING ELSE`);
  }

  [inspect.custom](): string {
    return this.toString();
  }

  toString(): string {
    return this.messagesInternal
      .filter((message) => message.role !== 'system')
      .map((message) => {
        let role: string = message.role;
        if (role === 'assistant') {
          role = '🤖';
        } else if (role === 'user') {
          role = '🤔';
        } else if (role === 'system') {
          role = '💻';
        }

        return `${role}: ${message.content}`;
      })
      .join('\n---\n');
  }

  static extractCode(text: Text | null): Text | null {
    if (!text) {
      return null;
    }

    let code: Text | null;
    if (!text.includes('```')) {
      code = text;
    } else {
      code =
        text
          ?.select(/```.*\n([\s\S]+?)\n```/s)
          ?.split('\n')
          .slice(1, -1)
          .join('\n').trimmed || null;
    }

    if (!code) {
      return null;
    }

    if (AiConversation.isJson(code)) {
      code.setFormat(DataFormat.Json);
    }

    return code;
  }

  static isJson(text: Text): boolean {
    return !!text.match(/^[{[][\s\S]*[\]}]$/);
  }
}
