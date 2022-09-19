import '../../src/setup';
import * as sh from '../../src/modules/shell/sh';

describe('shell module', () => {
  describe('ls', () => {
    it('should list files', async () => {
      const files = sh.ls(`${__dirname}/../assets/search`).value;

      expect(files[0]).toBe('children.json');
      expect(files[1]).toBe('men.json');
      expect(files[2]).toBe('women.json');
    });
  });

  describe('find', () => {
    it('should list files', async () => {
      const files = sh
        .find(`${__dirname}/../assets/search`)
        .value.filter((file) => file.endsWith('.json'));

      expect(files[0]).toMatch(/[/\\]children\.json$/);
      expect(files[1]).toMatch(/[/\\]men\.json$/);
      expect(files[2]).toMatch(/[/\\]women\.json$/);
    });
  });

  describe('grep', () => {
    it('should find file names by string', async () => {
      const files = sh.grep(
        '-l',
        'shoe',
        `${__dirname}/../assets/search/*.json`,
      ).lines.value;

      expect(files[0]).toMatch(/men\.json$/);
      expect(files[1]).toMatch(/women\.json$/);
    });

    it('should find matches by string', async () => {
      const matches = sh.grep('shoe', `${__dirname}/../assets/search/*.json`)
        .lines.value;

      expect(matches[0]).toBe(`      "name": "Leather shoe",`);
    });
  });
});
