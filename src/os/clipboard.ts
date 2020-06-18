import { readSync, writeSync } from 'clipboardy';
import { Response } from '../web/response';
import { web } from '../web';
import { WithJson } from '../extensions/json';
import { WithPrint } from '../extensions/print';
import { WithVscode } from '../extensions/vscode';
import { WithCsv } from '../extensions/csv';
import { WithText } from '../extensions/text';
import { WithData } from '../extensions/data';

export class UnwrappedClipboard {
  get text() {
    return readSync();
  }

  set text(value: string) {
    writeSync(value);
  }

  fetch(): Response {
    const text = this.text;
    if (/https?:\/\//.test(text)) {
      return web.get(text);
    }

    if (!/^fetch\(/.test(text)) {
      throw new Error('Nothing to fetch in clipboard');
    }

    return eval(text);
  }
}

export class Clipboard extends WithCsv(
  WithJson(WithText(WithData(WithVscode(WithPrint(UnwrappedClipboard))))),
) {}
