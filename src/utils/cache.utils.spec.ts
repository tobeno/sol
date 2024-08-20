import { describe, expect, it, vi } from 'vitest';
import { TmpFile } from '../wrappers/tmp-file.wrapper';
import { fileCached, runtimeCached } from './cache.utils';

describe('cache', () => {
  describe('runtimeCached', () => {
    it('should cache the value', async () => {
      const fn = vi.fn().mockReturnValue('value');

      await expect(runtimeCached('test', fn)).resolves.toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
      await expect(runtimeCached('test', fn)).resolves.toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('fileCached', () => {
    it('should cache the value', async () => {
      const fn = vi.fn().mockReturnValue('value');

      const tmpFile = TmpFile.create();

      await expect(fileCached(tmpFile, fn)).resolves.toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
      await expect(fileCached(tmpFile, fn)).resolves.toBe('value');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
