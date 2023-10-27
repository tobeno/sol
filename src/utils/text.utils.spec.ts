import { describe, expect, it } from 'vitest';
import {
  camelcaseText,
  capitalizeText,
  constantcaseText,
  decapitalizeText,
  extractText,
  filterLines,
  grepLines,
  kebabcaseText,
  lines,
  mapLines,
  pascalcaseText,
  replaceLines,
  rfilterLines,
  rgrepLines,
  rsortLines,
  snakecaseText,
  sortLines,
  titlecaseText,
} from './text.utils';

describe('text utils', () => {
  describe('lines', () => {
    it('should split the string up into its lines', async () => {
      const result = lines('Hello\nWorld\n');
      expect(result).toEqual(['Hello', 'World']);
    });
  });

  describe('mapLines', () => {
    it('should map the lines of the string', async () => {
      const result = mapLines('Hello\nWorld\n', (line) => line.toUpperCase());
      expect(result).toBe('HELLO\nWORLD\n');
    });
  });

  describe('filterLines', () => {
    it('should filter the lines of the string', async () => {
      const result = filterLines('Hello\nWorld\n', (line) =>
        line.includes('ll'),
      );
      expect(result).toBe('Hello\n');
    });
  });

  describe('rfilterLines', () => {
    it('should filter the lines of the string inversed', async () => {
      const result = rfilterLines('Hello\nWorld\n', (line) =>
        line.includes('ll'),
      );
      expect(result).toBe('World\n');
    });
  });

  describe('grepLines', () => {
    it('should grep the lines of the string', async () => {
      const result = grepLines('Hello\nWorld\n', 'll');
      expect(result).toBe('Hello\n');
    });
  });

  describe('rgrepLines', () => {
    it('should grep the lines of the string inversed', async () => {
      const result = rgrepLines('Hello\nWorld\n', 'll');
      expect(result).toBe('World\n');
    });
  });

  describe('sortLines', () => {
    it('should sort the lines of the string', async () => {
      const result = sortLines('World\nHello\n');
      expect(result).toBe('Hello\nWorld\n');
    });
  });

  describe('rsortLines', () => {
    it('should sort the lines of the string inversed', async () => {
      const result = rsortLines('Hello\nWorld\n');
      expect(result).toBe('World\nHello\n');
    });
  });

  describe('replaceLines', () => {
    it('should replace the pattern in each line of the string', async () => {
      const result = replaceLines('Hello\nWorld\n', 'l', 'z');
      expect(result).toBe('Hezlo\nWorzd\n');
    });
  });

  describe('extractText', () => {
    it('should return all matches in the string', async () => {
      const result = extractText('Hello Hello', 'ello');
      expect(result).toEqual(['ello', 'ello']);
    });
  });

  describe('capitalizeText', () => {
    it('should capitalize the string', async () => {
      const result = capitalizeText('hello world');
      expect(result).toBe('Hello world');
    });
  });

  describe('decapitalizeText', () => {
    it('should decapitalize the string', async () => {
      const result = decapitalizeText('Hello World');
      expect(result).toBe('hello World');
    });
  });

  describe('pascalcaseText', () => {
    it('should PascalCase the string', async () => {
      const result = pascalcaseText('hello world');
      expect(result).toBe('HelloWorld');
    });
  });

  describe('camelcaseText', () => {
    it('should camelCase the string', async () => {
      const result = camelcaseText('hello world');
      expect(result).toBe('helloWorld');
    });
  });

  describe('kebabcaseText', () => {
    it('should kebab-case the string', async () => {
      const result = kebabcaseText('hello world');
      expect(result).toBe('hello-world');
    });
  });

  describe('titlecaseText', () => {
    it('should Title Case the string', async () => {
      const result = titlecaseText('hello world');
      expect(result).toBe('Hello World');
    });
  });

  describe('snakecaseText', () => {
    it('should snake_case the string', async () => {
      const result = snakecaseText('hello world');
      expect(result).toBe('hello_world');
    });
  });

  describe('constantcaseText', () => {
    it('should CONSTANT_CASE the string', async () => {
      const result = constantcaseText('hello world');
      expect(result).toBe('HELLO_WORLD');
    });
  });
});
