import { Xml } from './xml.wrapper';

describe('Xml', () => {
  describe('element', () => {
    it('should return the first element in a document', async () => {
      const xml = Xml.create('<product><p>foo</p></product>');
      expect(xml.node.type).toBe('root');
      expect(xml.element?.node.type).toBe('tag');
      expect(xml.element?.node.name).toBe('product');
    });

    it('should return null if no elements in the document', async () => {
      const xml = Xml.create('foo');
      expect(xml.node.type).toBe('root');
      expect(xml.element).toBeNull();
    });
  });

  describe('node', () => {
    it('should return the node of the current element', async () => {
      const xml = Xml.create('<product><p>foo</p></product>');
      expect(xml.node.type).toBe('root');
      expect(xml.element?.node.type).toBe('tag');
    });
  });

  describe('attributes', () => {
    it('should return the attributes for the current element', async () => {
      const xml = Xml.create('<product class="foo" id="bar"></product>');
      expect(xml.element?.attributes.value).toEqual({
        class: 'foo',
        id: 'bar',
      });
    });
  });

  describe('attribute', () => {
    it('should return the attribute for the current element', async () => {
      const xml = Xml.create('<product class="foo" id="bar"></product>');
      expect(xml.element?.attribute('class')?.value).toBe('foo');
    });
  });

  describe('content', () => {
    it('should return the content of the current element', async () => {
      const xml = Xml.create('<product class="foo" id="bar">test</product>');
      expect(xml.element?.content.value).toEqual('test');
    });

    it('should return the content of the current element if nested', async () => {
      const xml = Xml.create(
        '<product class="foo" id="bar"><variant>test</variant><variant>test2</variant></product>',
      );
      expect(xml.element?.content.value).toEqual('test\ntest2');
    });
  });

  describe('find', () => {
    it('should return the first matching element', async () => {
      const xml = Xml.create(
        '<product class="foo" id="bar"><name>test</name><variant>test2</variant></product>',
      );
      expect(
        xml.find((e) => e.type === 'tag' && e.name === 'variant')?.text.value,
      ).toEqual('<variant>test2</variant>');
    });
  });

  describe('filter', () => {
    it('should return all matching elements', async () => {
      const xml = Xml.create(
        '<product class="foo" id="bar"><name>test</name><variant>test2</variant></product><variant>test3</variant>',
      );
      expect(
        xml
          .filter((e) => e.type === 'tag' && e.name === 'variant')
          ?.map((e) => e.text.value).value,
      ).toEqual(['<variant>test2</variant>', '<variant>test3</variant>']);
    });
  });

  describe('traverse', () => {
    it('should traverse all nodes if the document', async () => {
      const xml = Xml.create(
        '<product class="foo" id="bar"><name>test</name><variant>test2</variant></product>',
      );
      const typeAndNames: string[] = [];
      xml.traverse((e) => {
        typeAndNames.push(`${e.type}:${'name' in e ? e.name : '-'}`);
      });
      expect(typeAndNames).toEqual([
        'root:-',
        'tag:product',
        'tag:name',
        'text:-',
        'tag:variant',
        'text:-',
      ]);
    });
  });

  describe('select', () => {
    it('should return the first matching element', async () => {
      const xml = Xml.create(
        '<product class="foo" id="bar">test <variant>test2</variant></product>',
      );
      expect(xml.select('variant')?.text.value).toEqual(
        '<variant>test2</variant>',
      );
    });
  });

  describe('selectAll', () => {
    it('should return all matching elements', async () => {
      const xml = Xml.create(
        '<product class="foo" id="bar">test <variant>test2</variant></product><variant>test3</variant>',
      );
      expect(xml.selectAll('variant')?.map((e) => e.text.value).value).toEqual([
        '<variant>test2</variant>',
        '<variant>test3</variant>',
      ]);
    });
  });

  describe('text', () => {
    it('should the XML for the current element', async () => {
      const xml = Xml.create('<product class="foo" id="bar">test</product>');
      expect(xml.text.value).toEqual(
        '<product class="foo" id="bar">test</product>',
      );
    });
  });
});
