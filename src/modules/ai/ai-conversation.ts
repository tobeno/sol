import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from 'openai';
import { inspect } from 'util';
import { createOpenAiChatCompletion, isOpenAiApiAvailable } from './open-ai';
import { createHash } from 'crypto';
import { Data } from '../data/data';
import { Text } from '../data/text';
import { open } from '../integrations/open';
import { Wrapper } from '../data/wrapper';

export class AiConversation extends Wrapper<ChatCompletionRequestMessage[]> {
  usage = Data.create({
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  });

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

    super(messages);
  }

  /**
   * Returns a MD5 has of the conversation.
   */
  private get hash(): string {
    const content = JSON.stringify(this.value);

    return createHash('md5').update(content).digest('hex');
  }

  get json(): Text {
    return Text.create(JSON.stringify(this.value, null, 2));
  }

  set json(value: Text | string) {
    this.value = JSON.parse(String(value));
  }

  get messages(): Data<ChatCompletionRequestMessage[]> {
    return Data.create(this.value);
  }

  get answers(): Data<Text[]> {
    return Data.create(
      this.value
        .filter((message) => message.role === 'assistant')
        .map((message) => Text.create(message.content)),
    );
  }

  get answer(): Text | null {
    return (this.answers.get(-1) as Text) || null;
  }

  get answerCode(): Text | null {
    return this.answer?.selectCode() || null;
  }

  get questions(): Data<Text[]> {
    return Data.create(
      this.value
        .filter((message) => message.role === 'user')
        .map((message) => Text.create(message.content)),
    );
  }

  get question(): Text | null {
    return (this.questions.get(-1) as Text) || null;
  }

  get questionCode(): Text | null {
    return this.question?.selectCode() || null;
  }

  get questionAndAnswer(): Text | null {
    return Text.create(
      (
        (this.question?.value || null) +
        '\n' +
        (this.answer?.value || null)
      ).trim(),
    );
  }

  get questionAndAnswerCode(): Text | null {
    return this.questionAndAnswer?.selectCode() || null;
  }

  ask(question: string): this {
    const { dryRun } = this.options;
    if (!isOpenAiApiAvailable() && !dryRun) {
      open(`https://chat.openai.com?message=${encodeURIComponent(question)}`);
      return this;
    }

    this.value.push({
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
          messages: this.value,
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

      const usage = this.usage.value;
      usage.promptTokens += response.usage?.prompt_tokens || 0;
      usage.completionTokens += response.usage?.completion_tokens || 0;
      usage.totalTokens += response.usage?.total_tokens || 0;
    } else {
      answer = 'This is a dry run';
    }

    this.value.push({
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
    return this.value
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
}
