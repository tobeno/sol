import { unwrapDeep } from '../../utils/data';
import { Text } from '../data/text';
import { AiConversation } from './ai-conversation';

describe('AiConversation', () => {
  describe('ask', () => {
    it('should ask a question', async () => {
      const conversation = new AiConversation({
        dryRun: true,
      }).ask('Hello');
      expect(conversation).toBeInstanceOf(AiConversation);
      expect(unwrapDeep(conversation.messages)).toMatchSnapshot('messages');
      expect(unwrapDeep(conversation.answers)).toMatchSnapshot('answers');
      expect(unwrapDeep(conversation.questions)).toMatchSnapshot('questions');
    });

    it('should ask a question with custom system message', async () => {
      const conversation = new AiConversation({
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
      const conversation = new AiConversation({
        dryRun: true,
      }).askCode('Hello');
      expect(conversation).toBeInstanceOf(AiConversation);
      expect(unwrapDeep(conversation.messages)).toMatchSnapshot('messages');
      expect(unwrapDeep(conversation.answers)).toMatchSnapshot('answers');
      expect(unwrapDeep(conversation.questions)).toMatchSnapshot('questions');
    });

    it('should ask a question with custom system message', async () => {
      const conversation = new AiConversation({
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

  describe('isJson', () => {
    it.each([
      ['Some text', false],
      ['{ "a": 1 }', true],
      ['[1, 2, 3]', true],
      ['{ "a": 1', false],
      ['[1, 2, 3', false],
    ])(`should for '%s' return '%s'`, (text, expected) => {
      expect(AiConversation.isJson(Text.create(text))).toBe(expected);
    });
  });

  describe('extractCode', () => {
    it.each([
      ['Some text', 'Some text'], // If no markings found, assume just code
      ['Some text\n```\nSome code\n```\nOther text', 'Some code'],
      ['Some text\n```markdown\nSome code\n```\nOther text', 'Some code'],
      ['{ "a": 1 }', '{ "a": 1 }'],
      ['[1, 2, 3]', '[1, 2, 3]'],
    ])(`should for '%s' return '%s'`, (text, expected) => {
      expect(AiConversation.extractCode(Text.create(text))?.value || null).toBe(
        expected,
      );
    });
  });
});
