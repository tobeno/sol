import { describe, expect, it } from 'vitest';
import { globals } from './global.mutation';

describe('global mutation', () => {
  describe('health', () => {
    it('should add valid globals', async () => {
      Object.keys(globals)
        .filter(
          (key) =>
            ![
              // Skip keys of globals that use require(...) which does not work in vitest
              'day',
              'debug',
              'exec',
              'jwt',
              'morphProject',
              'sol',
            ].includes(key),
        )
        .forEach((key) => {
          expect((global as any)[key]).toBeTruthy();
        });
    });
  });
});
