import { JSDOM } from 'jsdom';
import { Data } from './data';

/**
 * Wrapper for XML strings
 */
export class Xml extends Data<string> {
  root: DocumentFragment;

  constructor(value: string) {
    super(value);
    this.root = JSDOM.fragment(value);
  }

  get innerText(): string {
    return this.root.textContent || '';
  }

  query(selector: string): Xml | null {
    const node = this.root.querySelector(selector);

    return node ? new Xml(node.outerHTML) : null;
  }

  toString() {
    return String(this);
  }
}
