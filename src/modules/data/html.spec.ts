import { Html } from './html';

describe('Html', () => {
  describe('element', () => {
    it('should return the first element in a document', async () => {
      const html = Html.create('<div><p>foo</p></div>');
      expect(html.node.type).toBe('root');
      expect(html.element?.node.type).toBe('tag');
      expect(html.element?.node.name).toBe('div');
    });

    it('should return null if no elements in the document', async () => {
      const html = Html.create('foo');
      expect(html.node.type).toBe('root');
      expect(html.element).toBeNull();
    });
  });

  describe('node', () => {
    it('should return the node of the current element', async () => {
      const html = Html.create('<div><p>foo</p></div>');
      expect(html.node.type).toBe('root');
      expect(html.element?.node.type).toBe('tag');
    });
  });

  describe('attributes', () => {
    it('should return the attributes for the current element', async () => {
      const html = Html.create('<div class="foo" id="bar"></div>');
      expect(html.element?.attributes.value).toEqual({
        class: 'foo',
        id: 'bar',
      });
    });
  });

  describe('attribute', () => {
    it('should return the attribute for the current element', async () => {
      const html = Html.create('<div class="foo" id="bar"></div>');
      expect(html.element?.attribute('class')?.value).toBe('foo');
    });
  });

  describe('content', () => {
    it('should return the content of the current element', async () => {
      const html = Html.create('<div class="foo" id="bar">test</div>');
      expect(html.element?.content.value).toEqual('test');
    });

    it('should return the content of the current element if nested', async () => {
      const html = Html.create(
        '<div class="foo" id="bar">test <a>test2</a></div>',
      );
      expect(html.element?.content.value).toEqual('test\ntest2');
    });
  });

  describe('find', () => {
    it('should return the first matching element', async () => {
      const html = Html.create(
        '<div class="foo" id="bar">test <a>test2</a></div>',
      );
      expect(
        html.find((e) => e.type === 'tag' && e.name === 'a')?.text.value,
      ).toEqual('<a>test2</a>');
    });
  });

  describe('filter', () => {
    it('should return all matching elements', async () => {
      const html = Html.create(
        '<div class="foo" id="bar">test <a>test2</a></div><a>test3</a>',
      );
      expect(
        html
          .filter((e) => e.type === 'tag' && e.name === 'a')
          ?.map((e) => e.text.value).value,
      ).toEqual(['<a>test2</a>', '<a>test3</a>']);
    });
  });

  describe('traverse', () => {
    it('should traverse all nodes if the document', async () => {
      const html = Html.create(
        '<div class="foo" id="bar">test <a>test2</a></div>',
      );
      const typeAndNames: string[] = [];
      html.traverse((e) => {
        typeAndNames.push(`${e.type}:${'name' in e ? e.name : '-'}`);
      });
      expect(typeAndNames).toEqual([
        'root:-',
        'tag:div',
        'text:-',
        'tag:a',
        'text:-',
      ]);
    });
  });

  describe('select', () => {
    it('should return the first matching element', async () => {
      const html = Html.create(
        '<div class="foo" id="bar">test <a>test2</a></div>',
      );
      expect(html.select('a')?.text.value).toEqual('<a>test2</a>');
    });
  });

  describe('selectAll', () => {
    it('should return all matching elements', async () => {
      const html = Html.create(
        '<div class="foo" id="bar">test <a>test2</a></div><a>test3</a>',
      );
      expect(html.selectAll('a')?.map((e) => e.text.value).value).toEqual([
        '<a>test2</a>',
        '<a>test3</a>',
      ]);
    });
  });

  describe('text', () => {
    it('should the HTML for the current element', async () => {
      const html = Html.create('<div class="foo" id="bar">test</div>');
      expect(html.text.value).toEqual('<div class="foo" id="bar">test</div>');
    });
  });
});
