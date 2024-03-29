import { describe, expect, it } from 'vitest';
import { DataFormat } from './data-format.wrapper';

describe('DataFormat', () => {
  describe('toExt', () => {
    it.each([
      [DataFormat.Csv, 'csv'],
      [DataFormat.Html, 'html'],
      [DataFormat.Json, 'json'],
      [DataFormat.Yaml, 'yaml'],
      [DataFormat.Xml, 'xml'],
      [DataFormat.Markdown, 'md'],
      [DataFormat.TextDate, 'date'],
      [DataFormat.TextNewlineSeparated, 'txt'],
      [DataFormat.TextCommaSeparated, 'txt'],
      [DataFormat.TextSemicolonSeparated, 'txt'],
    ])(`should for %s return %s`, (format, ext) => {
      expect(DataFormat.toExt(format)).toBe(ext);
    });
  });
});
