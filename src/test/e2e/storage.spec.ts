import { describe, expect, it } from '@jest/globals';
import '../../setup';
import { grepFiles } from '../../utils/search.utils';

describe('storage module', () => {
  const testAssetsPath = `${__dirname}/../assets`;

  describe('search', () => {
    it('should grep by string', async () => {
      const files = grepFiles('shoe', `${testAssetsPath}/search`);

      expect(files.map((file) => file.basename).sorted.value).toEqual([
        'men.json',
        'women.json',
      ]);

      const text = files
        .map((file) => file.basename.slice(0, -5))
        .sorted.join(',');

      expect(text.value).toBe('men,women');
    });

    it('should grep by regex', async () => {
      const files = grepFiles(
        /"name": "[^"]+shoe"/,
        `${testAssetsPath}/search`,
      );

      expect(files.map((file) => file.basename).sorted.value).toEqual([
        'men.json',
        'women.json',
      ]);

      const text = files
        .map((file) => file.basename.slice(0, -5))
        .sorted.join(',');

      expect(text.value).toBe('men,women');
    });
  });
});
