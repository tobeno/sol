import { Wrapper } from './wrapper';
import { Text } from './text';
import { DataFormat } from './data-format';
import type { AnyNode, Element, Text as TextNode } from 'domhandler';
import type { selectAll, selectOne } from 'css-select';
import { inspect } from 'util';
import { Data } from './data';

export class Html<
  NodeType extends AnyNode = AnyNode,
> extends Wrapper<NodeType> {
  get text(): Text {
    const { default: render } =
      require('dom-serializer') as typeof import('dom-serializer');

    return Text.create(render(this.value), DataFormat.Html);
  }

  get type() {
    return this.value.type;
  }

  get attributes(): Data<Record<string, string>> {
    return Data.create((this.value as Element).attribs || {});
  }

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

  attribute(name: string): Text | null {
    const value = (this.value as Element).attribs?.[name];

    return value ? Text.create(value) : null;
  }

  filter(cb: (n: AnyNode) => boolean): Data<Html[]> {
    const DomUtils = require('domutils') as typeof import('domutils');

    return Data.create(
      DomUtils.filter(cb, this.value).map((e) => Html.create(e)),
    );
  }

  find(cb: (n: AnyNode) => boolean): Html | null {
    return this.filter(cb).value[0] || null;
  }

  select(selector: Parameters<typeof selectOne>[0]): Html | null {
    const CSSselect = require('css-select') as typeof import('css-select');
    const element = CSSselect.selectOne(selector, this.value);

    return element ? Html.create(element) : null;
  }

  selectAll(selector: Parameters<typeof selectAll>[0]): Data<Html[]> {
    const CSSselect = require('css-select') as typeof import('css-select');

    return Data.create(
      CSSselect.selectAll(selector, this.value).map((e) => Html.create(e)),
    );
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom](): string {
    return `Html { ${this.text} }`;
  }

  toString(): string {
    return this.text.value;
  }

  static create(value: Text | String | AnyNode | string | any): Html {
    if (value instanceof Html) {
      return value;
    }

    if (value instanceof Text || value instanceof String) {
      value = value.toString();
    }

    if (value && typeof value === 'object') {
      return new Html(value);
    }

    const htmlparser2 = require('htmlparser2') as typeof import('htmlparser2');

    return new Html(htmlparser2.parseDocument(value));
  }
}
