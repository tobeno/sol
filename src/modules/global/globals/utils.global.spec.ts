import * as utils from './utils.global';
import path from 'path';

describe('utils global', () => {
  describe('health', () => {
    it('should export all utils', async () => {
      const utilNames = Object.keys(utils);
      const expectedUtilNames: string[] = [];
      files(path.join(__dirname, '../../../utils/**.ts')).forEach((file) => {
        if (file.path.endsWith('.spec.ts')) {
          return;
        }

        expectedUtilNames.push(...Object.keys(file.require()));
      });

      expect(utilNames.sort()).toEqual(expectedUtilNames.sort());
    });
  });
});
