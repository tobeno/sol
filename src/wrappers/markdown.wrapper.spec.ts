import { describe, expect, it } from 'vitest';
import { Markdown } from './markdown.wrapper';

describe('Markdown', () => {
  describe('text', () => {
    it('should return the text of the Markdown document', async () => {
      const markdown = Markdown.create('Hello World\n\n- Test');
      expect(markdown.text.value).toBe('Hello World\n\n- Test');
    });
  });

  describe('html', () => {
    it('should return the HTML of the Markdown document', async () => {
      const markdown = Markdown.create('Hello World\n\n- Test');
      expect(markdown.html.value).toBe(
        '<p>Hello World</p>\n<ul>\n<li>Test</li>\n</ul>\n',
      );
    });
  });
});
