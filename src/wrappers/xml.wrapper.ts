import type { selectAll, selectOne } from 'css-select';
import { ElementType } from 'domelementtype';
import type { AnyNode, Element, Text as TextNode } from 'domhandler';
import { inspect } from 'util';
import type { MaybeWrapped } from '../interfaces/wrapper.interfaces';
import { unwrap } from '../utils/wrapper.utils';
import { DataFormat } from './data-format.wrapper';
import { Data } from './data.wrapper';
import { Text } from './text.wrapper';
import { Wrapper } from './wrapper.wrapper';
import module from 'node:module';

const require = module.createRequire(import.meta.url);

/**
 * Wrapper for XML documents or snippets.
 */
export class Xml<NodeType extends AnyNode = AnyNode> extends Wrapper<NodeType> {
  static readonly usageHelp = `
> xml('<root><title>Test</title></root>').select('title').content
> xml('<root><product quantity="2">Test</product><product quantity="1">Test 2</product></root>').selectAll('product').map(p => Number(p.attributes.get('quantity'))).sum
  `.trim();

  /**
   * Returns the node of the current HTML.
   */
  get node(): NodeType {
    return this.value;
  }

  /**
   * Returns the first element in the HTML (or the current if it is already an element).
   */
  get element(): Xml<Element> | null {
    if (this.value.type !== ElementType.Tag) {
      return (this.find((n) => n.type === ElementType.Tag) as any) || null;
    }

    return this as any;
  }

  /**
   * Returns the type of the XML node.
   */
  get type() {
    return this.value.type;
  }

  /**
   * Returns the attributes of the XML node.
   */
  get attributes(): Data<Record<string, string>> {
    return Data.create((this.value as Element).attribs || {});
  }

  /**
   * Returns the text content of the XML node.
   */
  get content(): Text {
    if (this.value.type === 'text') {
      const node = this.value as TextNode;

      return Text.create(node.data);
    }

    return Text.create(
      this.filter((n) => n.type === 'text')
        .value.map((n) => n.content.value.trim())
        .join('\n'),
    );
  }

  /**
   * Returns the value of the given attribute.
   */
  attribute(name: string): Text | null {
    const value = (this.value as Element).attribs?.[name];

    return value ? Text.create(value) : null;
  }

  /**
   * Returns all XML nodes matching the given callback.
   */
  filter(cb: (n: AnyNode) => boolean): Data<Xml[]> {
    const DomUtils = require('domutils') as typeof import('domutils');

    return Data.create(
      DomUtils.filter(cb, this.value).map((e) => Xml.create(e)),
    );
  }

  /**
   * Returns the first XML node matching the given callback.
   */
  find(cb: (n: AnyNode) => boolean): Xml | null {
    return this.filter(cb).value[0] || null;
  }

  /**
   * Traverses all nodes in the XML document.
   */
  traverse(cb: (n: AnyNode) => void): this {
    this.filter((n) => {
      cb(n);
      return false;
    });

    return this;
  }

  /**
   * Returns the first XML node matching the given selector.
   */
  select(selector: Parameters<typeof selectOne>[0]): Xml | null {
    const CSSselect = require('css-select') as typeof import('css-select');
    const element = CSSselect.selectOne(selector, this.value);

    return element ? Xml.create(element) : null;
  }

  /**
   * Returns all XML nodes matching the given selector.
   */
  selectAll(selector: Parameters<typeof selectAll>[0]): Data<Xml[]> {
    const CSSselect = require('css-select') as typeof import('css-select');

    return Data.create(
      CSSselect.selectAll(selector, this.value).map((e) => Xml.create(e)),
    );
  }

  /**
   * Returns the XML as text.
   */
  get text(): Text {
    const { default: render } =
      require('dom-serializer') as typeof import('dom-serializer');

    return Text.create(render(this.value), DataFormat.Html);
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log).
   */
  [inspect.custom](): string {
    return `Xml { ${this.text} }`;
  }

  override toString(): string {
    return this.text.value;
  }

  static create(value: AnyNode | MaybeWrapped<string> | any): Xml {
    let result: Xml | null = null;
    if (value instanceof Xml) {
      result = value;
    }

    if (!result) {
      value = unwrap(value);

      if (value && typeof value === 'object') {
        result = new Xml(value);
      }
    }

    if (!result) {
      const htmlparser2 =
        require('htmlparser2') as typeof import('htmlparser2');

      result = new Xml(
        htmlparser2.parseDocument(value, {
          xmlMode: true,
        }),
      );
    }

    return withHelp(
      result,
      `
Xml wrapper around a XML string.

Usage:
${Xml.usageHelp}
    `,
    );
  }
}
