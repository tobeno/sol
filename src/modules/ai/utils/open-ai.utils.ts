import type {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
  OpenAIApi,
} from 'openai';

function getOpenAi() {
  return require('openai') as typeof import('openai');
}

export function isOpenAiApiAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export function getOpenAiApi(): OpenAIApi {
  if (!isOpenAiApiAvailable()) {
    throw new Error(
      'To use the OpenAI API the OPENAI_API_KEY needs to be configured.',
    );
  }

  const openai = getOpenAi();

  return new openai.OpenAIApi(
    new openai.Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  );
}

export async function createOpenAiChatCompletion(
  request: Omit<CreateChatCompletionRequest, 'model'>,
): Promise<CreateChatCompletionResponse> {
  return (
    await getOpenAiApi().createChatCompletion({
      model: 'gpt-3.5-turbo',
      ...request,
    })
  ).data;
}
