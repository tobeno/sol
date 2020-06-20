import { readSync, writeSync } from 'clipboardy';
import { WithText } from '../extensions/text';
import { WithFile } from '../extensions/file';
import { WithPrint } from '../extensions/print';

export class UnwrappedClipboard {
  get text() {
    return readSync();
  }

  set text(value: string) {
    writeSync(value);
  }
}

export class Clipboard extends WithFile(
  WithPrint(WithText(UnwrappedClipboard)),
) {}

export const clipboard = new Clipboard();
