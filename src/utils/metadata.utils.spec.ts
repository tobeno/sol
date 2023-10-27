import { describe, expect, it } from '@jest/globals';
import { getHelp, getSolMetadata, withSolMetadata } from './metadata.utils';

describe('metadata utils', () => {
  describe('withSolMetadata', () => {
    it('should add metadata to a target', async () => {
      const target = {};
      withSolMetadata(target, { help: 'help' });
      expect(getSolMetadata(target)).toEqual({ help: 'help' });
    });
  });

  describe('withHelp', () => {
    it('should add help to a target', async () => {
      const target = {};
      withHelp(target, 'help');
      expect(getHelp(target)).toEqual('help');
    });
  });
});
