import { describe, expect, it } from '@jest/globals';

describe('String mutation', () => {
  describe('text', () => {
    it('should return a Text for the string', async () => {
      expect('hello'.text.value).toEqual('hello');
    });
  });
});

export {};
