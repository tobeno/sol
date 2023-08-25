import type { OpenAI } from 'openai';
import type {
  ChatCompletion,
  CompletionCreateParamsNonStreaming,
  CreateChatCompletionRequestMessage,
} from 'openai/resources/chat/completions';

export type OpenAiChatCompletionRequestMessage =
  CreateChatCompletionRequestMessage;
export type OpenAiChatCompletionRequest = CompletionCreateParamsNonStreaming;
export type OpenAiChatCompletionResponse = ChatCompletion;

function getOpenAi() {
  return require('openai') as typeof import('openai');
}

export function isOpenAiApiAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export function getOpenAiApi(): OpenAI {
  if (!isOpenAiApiAvailable()) {
    throw new Error(
      'To use the OpenAI API the OPENAI_API_KEY needs to be configured.',
    );
  }

  const openai = getOpenAi();

  return new openai.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function createOpenAiChatCompletion(
  request: Omit<OpenAiChatCompletionRequest, 'model'>,
): Promise<OpenAiChatCompletionResponse> {
  return getOpenAiApi().chat.completions.create({
    model: 'gpt-3.5-turbo',
    ...request,
  } as CompletionCreateParamsNonStreaming);
}
