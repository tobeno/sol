import '../../src/setup';
import { grep } from '../../src/modules/storage/search';

describe('storage module', () => {
  describe('search', () => {
    it('should grep by string', async () => {
      const files = grep('shoe', `${__dirname}/../assets/search`);

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
      const files = grep(
        /"name": "[^"]+shoe"/,
        `${__dirname}/../assets/search`,
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
