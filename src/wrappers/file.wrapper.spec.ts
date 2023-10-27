import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { codeToAst } from '../modules/transform';
import { File } from './file.wrapper';
import { Html } from './html.wrapper';
import { Markdown } from './markdown.wrapper';
import { TmpFile } from './tmp-file.wrapper';
import { Xml } from './xml.wrapper';

// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
const __dirname = path.dirname(new URL(import.meta.url).pathname);

describe('File', () => {
  const testAssetsPath = path.join(__dirname, '../test/assets');

  describe('create', () => {
    it('should create a file', async () => {
      const file = File.create('/tmp/sol-test-' + Date.now());
      try {
        file.delete();
        expect(file.exists).toBe(false);
        file.create();
        expect(file.exists).toBe(true);
      } finally {
        file.delete();
      }
    });

    it('should ignore already existing files', async () => {
      const file = File.create(`${testAssetsPath}/search/men.json`);
      expect(file.exists).toBe(true);
      file.create();
      expect(file.exists).toBe(true);
    });
  });

  describe('exists', () => {
    it('should return true if the file exists', async () => {
      const file = File.create(`${testAssetsPath}/search/men.json`);
      expect(file.exists).toBe(true);
    });

    it('should return false if the file does not exists', async () => {
      const file = File.create(`${testAssetsPath}/search/does-not-exist.json`);
      expect(file.exists).toBe(false);
    });

    it('should create a file', async () => {
      const file = File.create('/tmp/sol-test-' + Date.now());
      try {
        expect(file.exists).toBe(false);
        file.exists = true;
        expect(file.exists).toBe(true);
      } finally {
        file.delete();
      }
    });

    it('should ignore already existing files', async () => {
      const file = File.create(`${testAssetsPath}/search/men.json`);
      expect(file.exists).toBe(true);
      file.exists = true;
      expect(file.exists).toBe(true);
    });
  });

  describe('cmd', () => {
    it('should return command for file', async () => {
      const file = File.create('/tmp');
      expect(file.cmd.value).toEqual('file("/tmp")');
    });
  });

  describe('name', () => {
    it('should return the name of the file', async () => {
      const file = File.create(`${testAssetsPath}/search/men.json`);
      expect(file.name).toBe('men');
    });
  });

  describe('name', () => {
    it('should return the name of the file', async () => {
      const file = File.create(`${testAssetsPath}/search/men.json`);
      expect(file.name).toBe('men');
    });
  });

  describe('basename', () => {
    it('should return the basename of the file', async () => {
      const file = File.create(`${testAssetsPath}/search/men.json`);
      expect(file.basename).toBe('men.json');
    });
  });

  describe('basenameWithoutExt', () => {
    it('should return the basename of the file without extension', async () => {
      const file = File.create(`${testAssetsPath}/search/men.test.json`);
      expect(file.basenameWithoutExt).toBe('men.test');
    });
  });

  describe('basenameWithoutExts', () => {
    it('should return the basename of the file without extensions', async () => {
      const file = File.create(`${testAssetsPath}/search/men.test.json`);
      expect(file.basenameWithoutExts).toBe('men');
    });
  });

  describe('exts', () => {
    it('should return the extensions of the file', async () => {
      const file = File.create(`${testAssetsPath}/search/men.test.json`);
      expect(file.exts).toEqual(['test', 'json']);
    });
  });

  describe('ext', () => {
    it('should return the extension of the file', async () => {
      const file = File.create(`${testAssetsPath}/search/men.test.json`);
      expect(file.ext).toBe('json');
    });
  });

  describe('dir', () => {
    it('should return the directory of the file', async () => {
      const file = File.create(`${testAssetsPath}/search/men.json`);
      expect(file.dir.name).toBe('search');
    });
  });

  describe('length', () => {
    it('should return the length of the file', async () => {
      const file = File.create(`${testAssetsPath}/search/men.json`);
      expect(file.length).toBe(391);
    });
  });

  describe('size', () => {
    it('should return the size of the file', async () => {
      const file = File.create(`${testAssetsPath}/search/men.json`);
      expect(file.size).toBe(391);
    });
  });

  describe('clear', () => {
    it('should clear the file', async () => {
      const file = TmpFile.create();
      file.text = 'test';
      expect(file).toHaveLength(4);
      file.clear();
      expect(file.exists).toBe(true);
      expect(file).toHaveLength(0);
    });
  });

  describe('empty', () => {
    it('should return true if the file is empty', async () => {
      const file = TmpFile.create();
      expect(file.empty).toBe(true);
    });
  });

  describe('text', () => {
    it('should return the text of the file', async () => {
      const file = TmpFile.create();
      writeFileSync(file.path, 'test', 'utf8');
      expect(file.text.value).toBe('test');
    });

    it('should write the text to the file', async () => {
      const file = TmpFile.create();
      file.text = 'test';
      expect(readFileSync(file.path, 'utf8')).toBe('test');
    });
  });

  // --- Extensions / Mutations ---
  describe('json', () => {
    it('should return the JSON of the file', async () => {
      const file = TmpFile.create();
      file.text = '{ "a": 1 }';
      expect(file.json.value).toEqual({ a: 1 });
    });

    it('should write the JSON to the file', async () => {
      const file = TmpFile.create();
      file.json = { a: 1 };
      expect(file.text.value).toBe('{\n  "a": 1\n}');
    });
  });

  describe('csv', () => {
    it('should return the CSV of the file', async () => {
      const file = TmpFile.create();
      file.text = 'a,b\n1,2';
      expect(file.csv.value).toEqual([{ a: '1', b: '2' }]);
    });

    it('should write the CSV to the file', async () => {
      const file = TmpFile.create();
      file.csv = [{ a: '1', b: '2' }];
      expect(file.text.value).toEqual('a,b\r\n1,2');
    });
  });

  describe('yaml', () => {
    it('should return the YAML of the file', async () => {
      const file = TmpFile.create();
      file.text = '- a: 1';
      expect(file.yaml.value).toEqual([{ a: 1 }]);
    });

    it('should write the YAML to the file', async () => {
      const file = TmpFile.create();
      file.yaml = [{ a: 1 }];
      expect(file.text.value).toEqual('- a: 1\n');
    });
  });

  describe('ast', () => {
    it('should return the AST for the code in the file', async () => {
      const file = TmpFile.create();
      file.text = 'const a = 1;';
      expect(file.ast.selectAll('Identifier')?.length).toBe(1);
    });

    it('should write the AST as code to the file', async () => {
      const file = TmpFile.create();
      file.ast = codeToAst('const a = 1;');
      expect(file.text.value).toBe('const a = 1;');
    });
  });

  describe('html', () => {
    it('should return the HTML of the file', async () => {
      const file = TmpFile.create();
      file.text = '<div>test</div>';
      expect(file.html.element?.node?.name).toEqual('div');
    });

    it('should write the HTML to the file', async () => {
      const file = TmpFile.create();
      file.html = Html.create('<div>test</div>');
      expect(file.text.value).toEqual('<div>test</div>');
    });
  });

  describe('xml', () => {
    it('should return the XML of the file', async () => {
      const file = TmpFile.create();
      file.text = '<product>test</product>';
      expect(file.xml.element?.node?.name).toEqual('product');
    });

    it('should write the XML to the file', async () => {
      const file = TmpFile.create();
      file.xml = Xml.create('<product>test</product>');
      expect(file.text.value).toEqual('<product>test</product>');
    });
  });

  describe('md', () => {
    it('should return the Markdown of the file', async () => {
      const file = TmpFile.create();
      file.text = '# test';
      expect(file.md.html.value).toEqual('<h1>test</h1>\n');
    });

    it('should write the Markdown to the file', async () => {
      const file = TmpFile.create();
      file.md = Markdown.create('# test');
      expect(file.text.value).toEqual('# test');
    });
  });
});
