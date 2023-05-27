import * as sh from './sh';
import { cat, exec, head, tail } from './sh';

describe('sh', () => {
  const testAssetsPath = `${__dirname}/../../test/assets`;

  describe('exec', () => {
    it('should exec the shell command', async () => {
      const result = exec('echo "hello"');
      expect(result.value).toBe('hello');
    });
  });

  describe('cat', () => {
    it('should return file contents', async () => {
      const result = cat(`${testAssetsPath}/search/children.json`).json;
      expect(result.value).toHaveProperty('products');
    });
  });

  describe('tail', () => {
    it('should tail the given file', async () => {
      const result = tail(
        {
          '-n': 10,
        } as any,
        `${testAssetsPath}/search/children.json`,
      );
      expect(result.count('\n')).toBe(9);
    });
  });

  describe('head', () => {
    it('should head the given file', async () => {
      const result = head(
        {
          '-n': 10,
        } as any,
        `${testAssetsPath}/search/children.json`,
      );
      expect(result.count('\n')).toBe(9);
    });
  });

  describe('ls', () => {
    it('should list files', async () => {
      const files = sh.ls(`${testAssetsPath}/search`).value;

      expect(files[0]).toBe('children.json');
      expect(files[1]).toBe('directory');
      expect(files[2]).toBe('men.json');
      expect(files[3]).toBe('women.json');
    });
  });

  describe('find', () => {
    it('should list files', async () => {
      const files = sh
        .find(`${testAssetsPath}/search`)
        .value.filter((file) => file.endsWith('.json'));

      expect(files[0]).toMatch(/[/\\]children\.json$/);
      expect(files[1]).toMatch(/[/\\]men\.json$/);
      expect(files[2]).toMatch(/[/\\]women\.json$/);
    });
  });

  describe('grep', () => {
    it('should find file names by string', async () => {
      const files = sh.grep('-l', 'shoe', `${testAssetsPath}/search/*.json`)
        .lines.value;

      expect(files[0].value).toMatch(/men\.json$/);
      expect(files[1].value).toMatch(/women\.json$/);
    });

    it('should find matches by string', async () => {
      const matches = sh.grep('shoe', `${testAssetsPath}/search/*.json`).lines
        .value;

      expect(matches[0].value).toBe(`      "name": "Leather shoe",`);
    });
  });
});
