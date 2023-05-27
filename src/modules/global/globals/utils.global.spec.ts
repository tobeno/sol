import path from 'path';
import * as utils from './utils.global';

describe('utils global', () => {
  describe('health', () => {
    it('should export all utils', async () => {
      const utilNames = Object.keys(utils);
      const expectedUtilNames: string[] = [];
      files(path.join(__dirname, '../../../utils/**.ts')).forEach((file) => {
        if (
          file.path.endsWith('.spec.ts') ||
          file.path.endsWith('sh.utils.ts')
        ) {
          return;
        }

        expectedUtilNames.push(...Object.keys(file.require()));
      });

      expect(utilNames.sort()).toEqual(expectedUtilNames.sort());
    });
  });
});
