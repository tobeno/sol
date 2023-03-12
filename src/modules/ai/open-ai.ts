import type {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
  OpenAIApi,
} from 'openai';

function getOpenAi() {
  return require('openai') as typeof import('openai');
}

function getOpenAiApi(): OpenAIApi {
  const openai = getOpenAi();

  return new openai.OpenAIApi(
    new openai.Configuration({
      apiKey: process.env.OPENAPI_API_KEY,
    }),
  );
}

export function createOpenAiChatCompletion(
  request: Omit<CreateChatCompletionRequest, 'model'>,
): CreateChatCompletionResponse {
  return awaitSync(
    getOpenAiApi().createChatCompletion({
      model: 'gpt-3.5-turbo',
      ...request,
    }),
  ).data;
}
