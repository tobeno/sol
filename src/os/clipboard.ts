import { readSync, writeSync } from 'clipboardy';
import { WithText } from '../wrappers/with-text';
import { WithFile } from '../wrappers/with-file';
import { WithPrint } from '../wrappers/with-print';

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
