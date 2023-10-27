import { describe, expect, it } from '@jest/globals';
import { day } from './day.utils';

describe('day', () => {
  describe('var', () => {
    it('should assign the dayjs instance to a variable', async () => {
      const date = day();
      date.var('someVariable');
      expect((global as any).someVariable).toBe(date);
    });
  });
});
