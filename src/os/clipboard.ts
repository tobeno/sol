import { readSync, writeSync } from 'clipboardy';
import { WithAllText } from '../extensions/all-text';

export class UnwrappedClipboard {
  get text() {
    return readSync();
  }

  set text(value: string) {
    writeSync(value);
  }
}

export class Clipboard extends WithAllText(UnwrappedClipboard) {}

export const clipboard = new Clipboard();