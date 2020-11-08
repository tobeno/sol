import { JSDOM } from 'jsdom';
import { Data } from './data';
import { wrapHtml } from './mapper';

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

  toString() {
    return String(this);
  }
}
