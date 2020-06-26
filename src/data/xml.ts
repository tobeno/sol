import { inspect } from 'util';
import { Data } from './data';
import { JSDOM } from 'jsdom';

/**
 * Wrapper for XML strings
 */
export class Xml extends Data {
  root: DocumentFragment;

  constructor(public value: string) {
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
