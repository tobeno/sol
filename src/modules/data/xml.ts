import { Text } from './text';
import { inspect } from 'util';
import { DataFormat } from './data-format';
import { Data } from './data';
import type { AnyNode, Element, Text as TextNode } from 'domhandler';
import type { selectAll, selectOne } from 'css-select';
import { Wrapper } from './wrapper';
import { MaybeWrapped } from '../../interfaces/data';
import { unwrap } from '../../utils/data';

/**
 * Wrapper for XML documents or snippets.
 */
export class Xml<NodeType extends AnyNode = AnyNode> extends Wrapper<NodeType> {
  /**
   * Returns the XML as text.
   */
  get text(): Text {
    const { default: render } =
      require('dom-serializer') as typeof import('dom-serializer');

    return Text.create(render(this.value), DataFormat.Html);
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
   * Prints just the data when inspecting (e.g. for console.log).
   */
  [inspect.custom](): string {
    return `Xml { ${this.text} }`;
  }

  toString(): string {
    return this.text.value;
  }

  static create(value: AnyNode | MaybeWrapped<string> | any): Xml {
    if (value instanceof Xml) {
      return value;
    }

    value = unwrap(value);

    if (value && typeof value === 'object') {
      return new Xml(value);
    }

    const htmlparser2 = require('htmlparser2') as typeof import('htmlparser2');

    return new Xml(
      htmlparser2.parseDocument(value, {
        xmlMode: true,
      }),
    );
  }
}
