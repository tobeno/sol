import { inspect } from 'util';
import { Data } from './data';
import { JSDOM } from 'jsdom';
import { wrapHtml } from './mapper';

/**
 * Wrapper for HTML strings
 */
export class Html extends Data {
  root: DocumentFragment;

  constructor(public value: string) {
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

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return this.value;
  }

  toString() {
    return this.value;
  }
}
