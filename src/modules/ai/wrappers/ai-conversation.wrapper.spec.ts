import { describe, expect, it } from 'vitest';
import { unwrapDeep } from '../../../utils/wrapper.utils';
import { AiConversation } from './ai-conversation.wrapper';

describe('AiConversation', () => {
  describe('ask', () => {
    it('should ask a question', async () => {
      const conversation = await new AiConversation({
        dryRun: true,
      }).ask('Hello');
      expect(conversation).toBeInstanceOf(AiConversation);
      expect(unwrapDeep(conversation.messages)).toMatchSnapshot('messages');
      expect(unwrapDeep(conversation.answers)).toMatchSnapshot('answers');
      expect(unwrapDeep(conversation.questions)).toMatchSnapshot('questions');
    });

    it('should ask a question with custom system message', async () => {
      const conversation = await new AiConversation({
        messages: [
          {
            role: 'system',
            content: 'You are a test assistant.',
          },
        ],
        dryRun: true,
      }).ask('Hello');
      expect(conversation).toBeInstanceOf(AiConversation);
      expect(unwrapDeep(conversation.messages)).toMatchSnapshot('messages');
      expect(unwrapDeep(conversation.answers)).toMatchSnapshot('answers');
      expect(unwrapDeep(conversation.questions)).toMatchSnapshot('questions');
    });
  });

  describe('askCode', () => {
    it('should ask a question', async () => {
      const conversation = await new AiConversation({
        dryRun: true,
      }).askCode('Hello');
      expect(conversation).toBeInstanceOf(AiConversation);
      expect(unwrapDeep(conversation.messages)).toMatchSnapshot('messages');
      expect(unwrapDeep(conversation.answers)).toMatchSnapshot('answers');
      expect(unwrapDeep(conversation.questions)).toMatchSnapshot('questions');
    });

    it('should ask a question with custom system message', async () => {
      const conversation = await new AiConversation({
        messages: [
          {
            role: 'system',
            content: 'You are a test assistant.',
          },
        ],
        dryRun: true,
      }).askCode('Hello');
      expect(conversation).toBeInstanceOf(AiConversation);
      expect(unwrapDeep(conversation.messages)).toMatchSnapshot('messages');
      expect(unwrapDeep(conversation.answers)).toMatchSnapshot('answers');
      expect(unwrapDeep(conversation.questions)).toMatchSnapshot('questions');
    });
  });
});
