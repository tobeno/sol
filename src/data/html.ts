import { inspect } from 'util';
import { cheerio } from '../integrations/cheerio';
import { WithAllText } from '../extensions/all-text';

export class UnwrappedHtml {
  private cheerio: CheerioStatic;

  constructor(public text: string) {
    this.cheerio = cheerio.load(this.text);
  }

  query(selector: string): Cheerio {
    return this.cheerio(selector);
  }

  root(): Cheerio {
    return this.cheerio.root();
  }

  /**
   * Prints just the data when inspecting (e.g. for console.log)
   */
  [inspect.custom]() {
    return this.text;
  }

  toString() {
    return this.text;
  }
}

export class Html extends WithAllText(UnwrappedHtml) {}

export function html(text: string) {
  return new Html(text);
}
