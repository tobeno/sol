import { inspect } from 'util';
import * as cheerio from 'cheerio';
import { WithCopy } from '../extensions/copy';
import { WithVscode } from '../extensions/vscode';
import { WithFile } from '../extensions/file';
import { WithPrint } from '../extensions/print';
import { WithText } from '../extensions/text';

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
}

export class Html extends WithText(
  WithCopy(WithPrint(WithVscode(WithFile(UnwrappedHtml)))),
) {}
