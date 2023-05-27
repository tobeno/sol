import type { selectAll, selectOne } from 'css-select';
import { ElementType } from 'domelementtype';
import type { AnyNode, Element, Text as TextNode } from 'domhandler';
import { inspect } from 'util';
import { MaybeWrapped } from '../interfaces/data.interfaces';
import { unwrap } from '../utils/data.utils';
import { Data } from './data.wrapper';
import { DataFormat } from './data-format.wrapper';
import { Text } from './text.wrapper';
import { Wrapper } from './wrapper.wrapper';

/**
 * Wrapper for HTML documents or snippets.
 */
export class Html<
  NodeType extends AnyNode = AnyNode,
> extends Wrapper<NodeType> {
  /**
   * Returns the node of the current HTML.
   */
  get node(): NodeType {
    return this.value;
  }

  /**
   * Returns the first element in the HTML (or the current if it is already an element).
   */
  get element(): Html<Element> | null {
    if (this.value.type !== ElementType.Tag) {
      return (this.find((n) => n.type === ElementType.Tag) as any) || null;
    }

    return this as any;
  }

  /**
   * Returns the type of the HTML node.
   */
  get type() {
    return this.value.type;
  }

  /**
   * Returns the attributes of the HTML node.
   */
  get attributes(): Data<Record<string, string>> {
    return Data.create((this.value as Element).attribs || {});
  }

  /**
   * Returns the text content of the HTML node.
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
   * Returns all HTML nodes matching the given callback.
   */
  filter(cb: (n: AnyNode) => boolean): Data<Html[]> {
    const DomUtils = require('domutils') as typeof import('domutils');

    return Data.create(
      DomUtils.filter(cb, this.value).map((e) => Html.create(e)),
    );
  }

  /**
   * Returns the first HTML node matching the given callback.
   */
  find(cb: (n: AnyNode) => boolean): Html | null {
    return this.filter(cb).value[0] || null;
  }

  /**
   * Traverses all nodes.
   */
  traverse(cb: (n: AnyNode) => void): this {
    this.filter((n) => {
      cb(n);
      return false;
    });

    return this;
  }

  /**
   * Returns the first HTML node matching the given selector.
   */
  select(selector: Parameters<typeof selectOne>[0]): Html | null {
    const CSSselect = require('css-select') as typeof import('css-select');
    const element = CSSselect.selectOne(selector, this.value);

    return element ? Html.create(element) : null;
  }

  /**
   * Returns all HTML nodes matching the given selector.
   */
  selectAll(selector: Parameters<typeof selectAll>[0]): Data<Html[]> {
    const CSSselect = require('css-select') as typeof import('css-select');

    return Data.create(
      CSSselect.selectAll(selector, this.value).map((e) => Html.create(e)),
    );
  }

  get text(): Text {
    const { default: render } =
      require('dom-serializer') as typeof import('dom-serializer');

    return Text.create(render(this.value), DataFormat.Html);
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log).
   */
  [inspect.custom](): string {
    return `Html { ${this.text} }`;
  }

  toString(): string {
    return this.text.value;
  }

  static create(value: AnyNode | MaybeWrapped<string> | any): Html {
    if (value instanceof Html) {
      return value;
    }

    value = unwrap(value);

    if (value && typeof value === 'object') {
      return new Html(value);
    }

    const htmlparser2 = require('htmlparser2') as typeof import('htmlparser2');

    return new Html(htmlparser2.parseDocument(value));
  }
}
