import { runtimeCached, fileCached } from './cache';
import { tmp } from '../storage/tmp';

describe('cache', () => {
  describe('runtimeCached', () => {
    it('should cache the value', async () => {
      const fn = jest.fn().mockReturnValue('value');

      expect(runtimeCached('test', fn)).toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(runtimeCached('test', fn)).toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('fileCached', () => {
    it('should cache the value', async () => {
      const fn = jest.fn().mockReturnValue('value');

      const tmpFile = tmp();

      expect(fileCached(tmpFile, fn)).toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fileCached(tmpFile, fn)).toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
