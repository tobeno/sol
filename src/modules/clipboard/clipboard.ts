import { Text } from '../data/text';

/**
 * Class for interacting with the OS clipboard.
 */
export class Clipboard {
  /**
   * Returns the clipboard contents as a string.
   */
  get value(): string {
    return require('clipboardy').readSync();
  }

  /**
   * Sets the clipboard contents.
   */
  set value(value: any) {
    require('clipboardy').writeSync(value);
  }

  /**
   * Returns the clipboard contents as a text.
   */
  get text(): Text {
    return Text.create(this.value);
  }

  /**
   * Sets the clipboard contents.
   */
  set text(value: Text | string) {
    this.value = String(value);
  }
}

let clipboard: Clipboard | null = null;

export function getClipboard(): Clipboard {
  if (!clipboard) {
    clipboard = new Clipboard();
  }

  return clipboard;
}
