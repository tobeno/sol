import { describe, expect, it } from 'vitest';
import { Ast } from './ast.wrapper';
import { DataFormat } from './data-format.wrapper';
import { DataType } from './data-type.wrapper';
import { Html } from './html.wrapper';
import { Markdown } from './markdown.wrapper';
import { Text } from './text.wrapper';
import { Url } from './url.wrapper';
import { Xml } from './xml.wrapper';

describe('Text', () => {
  describe('ext', () => {
    it('should return the correct extension without format', async () => {
      const text = Text.create('Hello World');
      expect(text.ext).toBe('txt');
    });

    it('should return the correct extension with format', async () => {
      const text = Text.create('Hello World', DataFormat.Json);
      expect(text.ext).toBe('json');
    });
  });

  describe('text', () => {
    it('should return itself', async () => {
      const text = Text.create('Hello World');
      expect(text.text).toBe(text);
    });
  });

  describe('camelcased', () => {
    it('should camelCase the value', async () => {
      const text = Text.create('Hello World');
      expect(text.camelcased.value).toBe('helloWorld');
    });
  });

  describe('snakecased', () => {
    it('should snake_case the value', async () => {
      const text = Text.create('Hello World');
      expect(text.snakecased.value).toBe('hello_world');
    });
  });

  describe('kebabcases', () => {
    it('should kebab-case the value', async () => {
      const text = Text.create('Hello World');
      expect(text.kebabcased.value).toBe('hello-world');
    });
  });

  describe('pascalcased', () => {
    it('should PascalCased the value', async () => {
      const text = Text.create('Hello World');
      expect(text.pascalcased.value).toBe('HelloWorld');
    });
  });

  describe('constantcased', () => {
    it('should CONSTANT_CASE the value', async () => {
      const text = Text.create('Hello World');
      expect(text.constantcased.value).toBe('HELLO_WORLD');
    });
  });

  describe('titlecased', () => {
    it('should Title Case the value', async () => {
      const text = Text.create('Hello World');
      expect(text.titlecased.value).toBe('Hello World');
    });
  });

  describe('uppercased', () => {
    it('should UPPERCASE the value', async () => {
      const text = Text.create('Hello World');
      expect(text.uppercased.value).toBe('HELLO WORLD');
    });
  });

  describe('lowercased', () => {
    it('should lowercase the value', async () => {
      const text = Text.create('Hello World');
      expect(text.lowercased.value).toBe('hello world');
    });
  });

  describe('capitalized', () => {
    it('should Capitalice the value', async () => {
      const text = Text.create('hello world');
      expect(text.capitalized.value).toBe('Hello world');
    });
  });

  describe('decapitalized', () => {
    it('should deapitalice the value', async () => {
      const text = Text.create('Hello World');
      expect(text.decapitalized.value).toBe('hello World');
    });
  });

  describe('urlencoded', () => {
    it('should URL encode the value', async () => {
      const text = Text.create('Hello World');
      expect(text.urlencoded.value).toBe('Hello%20World');
    });
  });

  describe('urldecode', () => {
    it('should URL decode the value', async () => {
      const text = Text.create('Hello%20World');
      expect(text.urldecoded.value).toBe('Hello World');
    });
  });

  describe('base64encoded', () => {
    it('should base64 encode the value', async () => {
      const text = Text.create('Hello World');
      expect(text.base64encoded.value).toBe('SGVsbG8gV29ybGQ');
    });
  });

  describe('base64decoded', () => {
    it('should base64 decode the value', async () => {
      const text = Text.create('SGVsbG8gV29ybGQ=');
      expect(text.base64decoded.value).toBe('Hello World');
    });
  });

  describe('compressed', () => {
    it('should compress value', async () => {
      const text = Text.create('Hello World');
      expect(text.compressed.value).toBe('eJzzSM3JyVcIzy_KSQEAGAsEHQ');
    });
  });

  describe('decompressed', () => {
    it('should decompress value', async () => {
      const text = Text.create('eJzzSM3JyVcIzy_KSQEAGAsEHQ');
      expect(text.decompressed.value).toBe('Hello World');
    });
  });

  describe('md5hashed', () => {
    it('should MD5 hash the value', async () => {
      const text = Text.create('Hello World');
      expect(text.md5hashed.value).toBe('b10a8db164e0754105b7a99be72e3fe5');
    });
  });

  describe('sha1hashed', () => {
    it('should SHA1 hash the value', async () => {
      const text = Text.create('Hello World');
      expect(text.sha1hashed.value).toBe(
        '0a4d55a8d778e5022fab701977c5d840bbc486d0',
      );
    });
  });

  describe('sha256hashed', () => {
    it('should SHA256 hash the value', async () => {
      const text = Text.create('Hello World');
      expect(text.sha256hashed.value).toBe(
        'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
      );
    });
  });

  describe('sha512hashed', () => {
    it('should SHA512 hash the value', async () => {
      const text = Text.create('Hello World');
      expect(text.sha512hashed.value).toBe(
        '2c74fd17edafd80e8447b0d46741ee243b7eb74dd2149a0ab1b9246fb30382f27e853d8585719e0e67cbda0daa8f51671064615d645ae27acb15bfb1447f459b',
      );
    });
  });

  describe('trimmed', () => {
    it('should trim the value', async () => {
      const text = Text.create(' Hello World ');
      expect(text.trimmed.value).toBe('Hello World');
    });
  });

  describe('number', () => {
    it('should convert integer strings to integer', async () => {
      const text = Text.create('123');
      expect(text.number).toBe(123);
    });

    it('should convert decimal strings to decimal', async () => {
      const text = Text.create('123.456');
      expect(text.number).toBe(123.456);
    });
  });

  describe('lines', () => {
    it('should return the lines of a string', async () => {
      const text = Text.create('Hello\nWorld');
      expect(text.lines.unwrapped).toEqual(['Hello', 'World']);
    });
  });

  describe('length', () => {
    it('should return the length of a string', async () => {
      const text = Text.create('Hello World');
      expect(text.length).toBe(11);
    });
  });

  describe('grepLines', () => {
    it('should return all matching lines', async () => {
      const text = Text.create('\nHello\nWorld');
      expect(text.grepLines('Hello').value).toEqual('Hello');
    });

    it('should return all matching lines when using RegExp', async () => {
      const text = Text.create('\nHello\nWorld');
      expect(text.grepLines(/Hel[l]o/).value).toEqual('Hello');
    });
  });

  describe('rgrepLines', () => {
    it('should return all not matching lines', async () => {
      const text = Text.create('\nHello\nWorld');
      expect(text.rgrepLines('Hello').value).toEqual('\nWorld');
    });

    it('should return all not matching lines when using RegExp', async () => {
      const text = Text.create('\nHello\nWorld');
      expect(text.rgrepLines(/Hel[l]o/).value).toEqual('\nWorld');
    });
  });

  describe('sortLines', () => {
    it('should sort lines', async () => {
      const text = Text.create('World\nHello');
      expect(text.sortLines().value).toEqual('Hello\nWorld');
    });

    it('should sort lines with trailing newline', async () => {
      const text = Text.create('World\nHello\n');
      expect(text.sortLines().value).toEqual('Hello\nWorld\n');
    });
  });

  describe('filterLines', () => {
    it('should filter lines', async () => {
      const text = Text.create('World\nHello');
      expect(text.filterLines((line) => line.includes('ello')).value).toEqual(
        'Hello',
      );
    });

    it('should filter lines with trailing newline', async () => {
      const text = Text.create('World\nHello\n');
      expect(text.filterLines((line) => line.includes('ello')).value).toEqual(
        'Hello\n',
      );
    });
  });

  describe('rfilterLines', () => {
    it('should filter lines not matching', async () => {
      const text = Text.create('World\nHello');
      expect(text.rfilterLines((line) => line.includes('ello')).value).toEqual(
        'World',
      );
    });

    it('should filter lines not matching with trailing newline', async () => {
      const text = Text.create('World\nHello\n');
      expect(text.rfilterLines((line) => line.includes('ello')).value).toEqual(
        'World\n',
      );
    });
  });

  describe('mapLines', () => {
    it('should map lines', async () => {
      const text = Text.create('Hello\nWorld');
      expect(text.mapLines((line) => line.toUpperCase()).value).toEqual(
        'HELLO\nWORLD',
      );
    });

    it('should map lines with trailing newline', async () => {
      const text = Text.create('Hello\nWorld\n');
      expect(text.mapLines((line) => line.toUpperCase()).value).toEqual(
        'HELLO\nWORLD\n',
      );
    });
  });

  describe('split', () => {
    it('should split the text', async () => {
      const text = Text.create('Hello World');
      expect(text.split(' ').unwrapped).toEqual(['Hello', 'World']);
    });
  });

  describe('replaceLines', () => {
    it('should replace in each line', async () => {
      const text = Text.create('Hello\nHello');
      expect(text.replaceLines('l', 'n').value).toEqual('Henlo\nHenlo');
    });

    it('should replace in each line with trailing newline', async () => {
      const text = Text.create('Hello\nHello\n');
      expect(text.replaceLines('l', 'n').value).toEqual('Henlo\nHenlo\n');
    });

    it('should replace in each line when using RegExp', async () => {
      const text = Text.create('Hello\nHello');
      expect(text.replaceLines(/[l]/, 'n').value).toEqual('Henlo\nHenlo');
    });

    it('should replace in each line when using RegExp with traling newline', async () => {
      const text = Text.create('Hello\nHello\n');
      expect(text.replaceLines(/[l]/, 'n').value).toEqual('Henlo\nHenlo\n');
    });
  });

  describe('appendLine', () => {
    it('should append a line', async () => {
      const text = Text.create('Hello');
      expect(text.appendLine('World').value).toEqual('Hello\nWorld');
    });
  });

  describe('prependLine', () => {
    it('should prepend a line', async () => {
      const text = Text.create('World');
      expect(text.prependLine('Hello').value).toEqual('Hello\nWorld');
    });
  });

  describe('append', () => {
    it('should append', async () => {
      const text = Text.create('Hello');
      expect(text.append(' World').value).toEqual('Hello World');
    });
  });

  describe('prepend', () => {
    it('should prepend', async () => {
      const text = Text.create('World');
      expect(text.prepend('Hello ').value).toEqual('Hello World');
    });
  });

  describe('replace', () => {
    it('should replace', async () => {
      const text = Text.create('Hello\nHello');
      expect(text.replace('l', 'n').value).toEqual('Henlo\nHello');
    });

    it('should replace when using RegExp', async () => {
      const text = Text.create('Hello\nHello');
      expect(text.replace(/[l]/, 'n').value).toEqual('Henlo\nHello');
    });
  });

  describe('repeat', () => {
    it('should repeat the text', async () => {
      const text = Text.create('Hello');
      expect(text.repeat(3).value).toEqual('HelloHelloHello');
    });
  });

  describe('match', () => {
    it('should match by RegExp', async () => {
      const text = Text.create('Hello');
      expect(text.match(/Hel/)).toBeTruthy();
    });
  });

  describe('matchAll', () => {
    it('should match all by RegExp', async () => {
      const text = Text.create('Hello');
      let matches = text.matchAll(/l/g);
      expect(matches).toHaveLength(2);
      expect(matches.map((match) => [...match]).value).toEqual([['l'], ['l']]);
    });
  });

  describe('slice', () => {
    it('should slice the text', async () => {
      const text = Text.create('Hello');
      expect(text.slice(1, 3).value).toEqual('el');
    });

    it('should slice the text from the end', async () => {
      const text = Text.create('Hello');
      expect(text.slice(-3, -1).value).toEqual('ll');
    });
  });

  describe('padStart', () => {
    it('should pad the text from the start', async () => {
      const text = Text.create('Hello');
      expect(text.padStart(7, ' ').value).toEqual('  Hello');
    });
  });

  describe('padEnd', () => {
    it('should pad the text from the end', async () => {
      const text = Text.create('Hello');
      expect(text.padEnd(7, ' ').value).toEqual('Hello  ');
    });
  });

  describe('includes', () => {
    it('should return true if the text includes the given string', async () => {
      const text = Text.create('Hello');
      expect(text.includes('llo')).toBe(true);
    });
  });

  describe('startsWith', () => {
    it('should return true if the text starts with the given string', async () => {
      const text = Text.create('Hello');
      expect(text.startsWith('He')).toBe(true);
    });
  });

  describe('endsWith', () => {
    it('should return true if the text ends with the given string', async () => {
      const text = Text.create('Hello');
      expect(text.endsWith('lo')).toBe(true);
    });
  });

  describe('indexOf', () => {
    it('should return the index of the given string', async () => {
      const text = Text.create('Hello');
      expect(text.indexOf('l')).toBe(2);
    });
  });

  describe('lastIndexOf', () => {
    it('should return the last index of the given string', async () => {
      const text = Text.create('Hello');
      expect(text.lastIndexOf('l')).toBe(3);
    });
  });

  describe('select', () => {
    it('should return the first match of the given string', async () => {
      const text = Text.create('Hello');
      expect(text.select('ll')?.value).toEqual('ll');
    });

    it('should return null if the given string is not included', async () => {
      const text = Text.create('Hello');
      expect(text.select('xx')).toBe(null);
    });

    it('should return the first match of the given RegExp', async () => {
      const text = Text.create('Hello');
      expect(text.select(/l{2}/)?.value).toEqual('ll');
    });

    it('should return null if the given RegExp does not match', async () => {
      const text = Text.create('Hello');
      expect(text.select(/x{2}/)).toBe(null);
    });
  });

  describe('selectCode', () => {
    it.each([
      ['Some text', 'Some text'], // If no markings found, assume just code
      ['Some text\n```\nSome code\n```\nOther text', 'Some code'],
      ['Some text\n```markdown\nSome code\n```\nOther text', 'Some code'],
      ['{ "a": 1 }', '{ "a": 1 }'],
      ['[1, 2, 3]', '[1, 2, 3]'],
    ])(`should for '%s' return '%s'`, (text, expected) => {
      expect(Text.create(text).selectCode()?.value || null).toBe(expected);
    });
  });

  describe('selectAll', () => {
    it('should return all matches of the given string', async () => {
      const text = Text.create('Hello');
      expect(text.selectAll('l').unwrapped).toEqual(['l', 'l']);
    });

    it('should return empty array if the given string is not included', async () => {
      const text = Text.create('Hello');
      expect(text.selectAll('xx').unwrapped).toEqual([]);
    });

    it('should return all matches of the given RegExp', async () => {
      const text = Text.create('Hello');
      expect(text.selectAll(/l/g).unwrapped).toEqual(['l', 'l']);
    });

    it('should return empty array if the given RegExp does not match', async () => {
      const text = Text.create('Hello');
      expect(text.selectAll(/x/g).unwrapped).toEqual([]);
    });
  });

  describe('setFormat', () => {
    it('should set the format', async () => {
      const text = Text.create('Hello');
      expect(text.setFormat(DataFormat.Csv).format).toEqual(DataFormat.Csv);
    });
  });

  describe('count', () => {
    it('should return the number of occurrences of a string', async () => {
      const text = Text.create('Hello');
      expect(text.count('l')).toEqual(2);
    });

    it('should return the number of matches of a RegExp', async () => {
      const text = Text.create('Hello');
      expect(text.count(/l/g)).toEqual(2);
    });
  });

  // --- Extensions / Mutations ---
  describe('json', () => {
    it('should convert from JSON', async () => {
      const text = Text.create('{ "a": 1 }');
      expect(text.json.value).toEqual({ a: 1 });
    });
  });

  describe('yaml', () => {
    it('should convert from YAML', async () => {
      const text = Text.create('- a: 1');
      expect(text.yaml.value).toEqual([{ a: 1 }]);
    });
  });

  describe('csv', () => {
    it('should convert from CSV', async () => {
      const text = Text.create('a,b,c\n1,2,3');
      expect(text.csv.value).toEqual([{ a: '1', b: '2', c: '3' }]);
    });
  });

  describe('md', () => {
    it('should convert from Markdown', async () => {
      const text = Text.create('# Hello');
      expect(text.md).toBeInstanceOf(Markdown);
      expect(text.md.html.value).toEqual('<h1>Hello</h1>\n');
    });
  });

  describe('html', () => {
    it('should convert from HTML', async () => {
      const text = Text.create('<h1>Hello</h1>');
      expect(text.html).toBeInstanceOf(Html);
      expect(text.html.element?.node.name).toEqual('h1');
    });
  });

  describe('xml', () => {
    it('should convert from XML', async () => {
      const text = Text.create('<product>Hello</product>');
      expect(text.xml).toBeInstanceOf(Xml);
      expect(text.xml.element?.node.name).toEqual('product');
    });
  });

  describe('ast', () => {
    it('should convert code to an AST', async () => {
      const text = Text.create('Hello');
      expect(text.ast).toBeInstanceOf(Ast);
    });
  });

  describe('url', () => {
    it('should convert string URL to an Url', async () => {
      const text = Text.create('https://example.com');
      expect(text.url).toBeInstanceOf(Url);
      expect(text.url.hostname.value).toEqual('example.com');
    });
  });

  describe('to', () => {
    it('should transform to the given data type', async () => {
      const text = Text.create('{ "a": 1 }', DataFormat.Json);
      expect(text.to(DataType.Object)).toEqual({ a: 1 });
    });
  });
});
