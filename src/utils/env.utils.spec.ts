import { describe, expect, it } from 'vitest';
import { getCwd, getEnv } from './env.utils';

describe('env utils', () => {
  describe('getEnv', () => {
    it('should return the environment variables', async () => {
      const env = getEnv();
      expect(env).toEqual(process.env);
    });
  });

  describe('getCwd', () => {
    it('should return the current working directory', async () => {
      const cwd = getCwd();
      expect(cwd).toBe(process.cwd());
    });
  });
});
