import clipboardy from 'clipboardy';
import { awaitSync } from '../utils/async';

export class Clipboard {
  get value(): string {
    return awaitSync(clipboardy.read());
  }

  set value(value: any) {
    awaitSync(clipboardy.write(value));
  }
}

let clipboard: Clipboard | null = null;

export function getClipboard(): Clipboard {
  if (!clipboard) {
    clipboard = new Clipboard();
  }

  return clipboard;
}
