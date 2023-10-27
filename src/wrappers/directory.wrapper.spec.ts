import { describe, expect, it } from 'vitest';
import { rmSync } from 'fs';
import path from 'path';
import { Directory } from './directory.wrapper';

// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
const __dirname = path.dirname(new URL(import.meta.url).pathname);

describe('Directory', () => {
  const testAssetsPath = path.join(__dirname, '../test/assets');

  describe('cmd', () => {
    it('should return command for directory', async () => {
      const dir = Directory.create('/tmp');
      expect(dir.cmd.value).toEqual('dir("/tmp")');
    });
  });

  describe('parent', () => {
    it('should return parent directory of a directory', async () => {
      const dir = Directory.create('/tmp');
      expect(dir.parent.path).toEqual('/');
    });
  });

  describe('name', () => {
    it('should return the name of a directory', async () => {
      const dir = Directory.create('/tmp');
      expect(dir.name).toBe('tmp');
    });
  });

  describe('exists', () => {
    it('should return true if a directory exists', async () => {
      const dir = Directory.create('/tmp');
      expect(dir.exists).toBe(true);
    });

    it('should return false if a directory does not exist', async () => {
      const dir = Directory.create('/does-not-exist');
      expect(dir.exists).toBe(false);
    });

    it('should create a directory if it does not exist', async () => {
      const dir = Directory.create('/tmp/sol-test-' + Date.now());
      try {
        expect(dir.exists).toBe(false);
        dir.exists = true;
        expect(dir.exists).toBe(true);
      } finally {
        if (dir.exists) {
          rmSync(dir.path, { recursive: true });
        }
      }
    });

    it('should ignore already existing directories', async () => {
      const dir = Directory.create('/tmp');
      expect(dir.exists).toBe(true);
      dir.exists = true;
      expect(dir.exists).toBe(true);
    });
  });

  describe('create', () => {
    it('should create a directory if it does not exist', async () => {
      const dir = Directory.create('/tmp/sol-test-' + Date.now());
      try {
        expect(dir.exists).toBe(false);
        dir.create();
        expect(dir.exists).toBe(true);
      } finally {
        if (dir.exists) {
          rmSync(dir.path, { recursive: true });
        }
      }
    });

    it('should ignore already existing directories', async () => {
      const dir = Directory.create('/tmp');
      expect(dir.exists).toBe(true);
      dir.create();
      expect(dir.exists).toBe(true);
    });
  });

  describe('relativePathFrom', () => {
    it('should return path of directory relative to the given path', async () => {
      expect(Directory.create('/tmp').relativePathFrom('/')).toBe('tmp');
      expect(Directory.create('/').relativePathFrom('/tmp')).toBe('..');
    });

    it('should return path of directory relative to the given directory', async () => {
      expect(
        Directory.create('/tmp').relativePathFrom(Directory.create('/')),
      ).toBe('tmp');
      expect(
        Directory.create('/').relativePathFrom(Directory.create('/tmp')),
      ).toBe('..');
    });
  });

  describe('items', () => {
    it('should return all items in the directory', async () => {
      const dir = Directory.create(`${testAssetsPath}/search`);
      expect(dir.items().length).toBe(4);
    });

    it('should return all matching items in the directory', async () => {
      const dir = Directory.create(`${testAssetsPath}/search`);
      expect(dir.items('*r*').length).toBe(2);
    });
  });

  describe('files', () => {
    it('should return all files in the directory', async () => {
      const dir = Directory.create(`${testAssetsPath}/search`);
      expect(dir.files().length).toBe(3);
    });

    it('should return matching files in the directory', async () => {
      const dir = Directory.create(`${testAssetsPath}/search`);
      expect(dir.files('*men*').length).toBe(2);
    });
  });

  describe('dirs', () => {
    it('should return all directories in the directory', async () => {
      const dir = Directory.create(`${testAssetsPath}/search`);
      expect(dir.dirs().length).toBe(1);
    });
  });

  describe('file', () => {
    it('should return file in directory', async () => {
      const dir = Directory.create(`${testAssetsPath}/search`);
      expect(dir.file('children.json').basename).toBe('children.json');
    });
  });

  describe('dir', () => {
    it('should return subdirectory in directory', async () => {
      const dir = Directory.create(`${testAssetsPath}/search`);
      expect(dir.dir('directory').basename).toBe('directory');
    });
  });

  describe('grep', () => {
    it('should return all files containing a given string', async () => {
      const dir = Directory.create(`${testAssetsPath}/search`);
      expect(dir.grep('Leather').length).toBe(2);
    });

    it('should return all files matching a given RegExp', async () => {
      const dir = Directory.create(`${testAssetsPath}/search`);
      expect(dir.grep(/Le[a]ther/).length).toBe(2);
    });
  });
});
