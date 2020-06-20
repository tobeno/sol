import { inspect } from 'util';
import { cheerio } from '../integrations/cheerio';
import { WithAllText } from '../wrappers/with-all-text';

export class UnwrappedXml {
  private cheerio: CheerioStatic;

  constructor(public text: string | any) {
    this.cheerio = cheerio.load(this.text, {
      xmlMode: true,
    });
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

export class Xml extends WithAllText(UnwrappedXml) {}

export function xml(text: string) {
  return new Xml(text);
}
