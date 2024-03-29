import { describe, expect, it, vi } from 'vitest';
import { TmpFile } from '../wrappers/tmp-file.wrapper';
import { fileCached, runtimeCached } from './cache.utils';

describe('cache', () => {
  describe('runtimeCached', () => {
    it('should cache the value', async () => {
      const fn = vi.fn().mockReturnValue('value');

      expect(runtimeCached('test', fn)).toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(runtimeCached('test', fn)).toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('fileCached', () => {
    it('should cache the value', async () => {
      const fn = vi.fn().mockReturnValue('value');

      const tmpFile = TmpFile.create();

      expect(fileCached(tmpFile, fn)).toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fileCached(tmpFile, fn)).toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
