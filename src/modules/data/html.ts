import { JSDOM } from 'jsdom';
import { Data, wrapObject } from './data';
import { Text } from './text';
import { DataSource } from './data-source';
import { DataFormat } from './data-format';

/**
 * Wrapper for HTML strings
 */
export class Html extends Data<string> {
  root: DocumentFragment;

  constructor(value: string) {
    super(value);
    this.root = JSDOM.fragment(value);
  }

  get innerText(): string {
    return this.root.textContent || '';
  }

  query(selector: string): Html | null {
    const node = this.root.querySelector(selector);

    return node ? wrapHtml(node.outerHTML) : null;
  }

  queryAll(selector: string): Data<Html[]> {
    const nodes = this.root.querySelectorAll(selector);

    const result: Html[] = [];

    nodes.forEach((node) => {
      result.push(wrapHtml(node.outerHTML));
    });

    return wrapObject(result);
  }

  toString() {
    return String(this);
  }
}

export function wrapHtml(
  value: string | String | Text,
  source: DataSource | null = null,
): Html {
  const html = new Html(String(value));

  if (source) {
    html.setSource(source);
  }

  return html;
}

export function unwrapHtml<ContentType = any>(value: Html): Text<ContentType> {
  return new Text<ContentType>(value.value, DataFormat.Html, value.source);
}
