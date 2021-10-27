import { JSDOM } from 'jsdom';
import { Data } from './data';
import { wrapHtml, wrapObject } from './transformer';

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
