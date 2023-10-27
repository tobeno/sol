import { describe, expect, it } from '@jest/globals';
import { globals } from './global.mutation';

describe('global mutation', () => {
  describe('health', () => {
    it('should add valid globals', async () => {
      Object.keys(globals).forEach((key) => {
        expect((global as any)[key]).toBeTruthy();
      });
    });
  });
});
