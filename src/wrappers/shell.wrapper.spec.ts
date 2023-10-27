import { beforeEach, describe, expect, it } from 'vitest';
import { execCommand } from '../utils/shell.utils';
import { Shell } from './shell.wrapper';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
const __dirname = path.dirname(new URL(import.meta.url).pathname);
describe('Shell', () => {
  const testAssetsPath = `${__dirname}/../test/assets`;
  let shell: Shell;

  beforeEach(async () => {
    shell = Shell.create(testAssetsPath);
  });

  describe('exec', () => {
    it('should exec the shell command', async () => {
      const result = execCommand('echo "hello"');
      expect(result.value).toBe('hello');
    });
  });

  describe('cat', () => {
    it('should return file contents', async () => {
      const result = shell.cat(`search/children.json`).json;
      expect(result.value).toHaveProperty('products');
    });
  });

  describe('tail', () => {
    it('should tail the given file', async () => {
      const result = shell.tail(`search/children.json`, {
        lines: 10,
      });
      expect(result.count('\n')).toBe(9);
    });
  });

  describe('head', () => {
    it('should head the given file', async () => {
      const result = shell.head(`search/children.json`, {
        lines: 10,
      });
      expect(result.count('\n')).toBe(9);
    });
  });

  describe('ls', () => {
    it('should list files', async () => {
      const files = shell.ls(`search`).value;

      expect(files[0].value).toBe('children.json');
      expect(files[1].value).toBe('directory');
      expect(files[2].value).toBe('men.json');
      expect(files[3].value).toBe('women.json');
    });
  });

  describe('grep', () => {
    it('should find file names by string', async () => {
      const files = shell.grep('shoe', `search/*.json`, {
        list: true,
        sort: true,
      }).value;

      expect(files[0].value).toMatch(/men\.json$/);
      expect(files[1].value).toMatch(/women\.json$/);
    });

    it('should find matches by string', async () => {
      const matches = shell.grep('shoe', `search/*.json`, {
        sort: true,
      }).value;

      expect(matches[0].value).toBe(
        `search/men.json:      "name": "Leather shoe",`,
      );
    });
  });
});
