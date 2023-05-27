import { MaybeWrapped } from '../../interfaces/wrapper.interfaces';
import { Text } from '../../wrappers/text.wrapper';

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
  set value(value: MaybeWrapped<string>) {
    require('clipboardy').writeSync(String(value));
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
  set text(value: MaybeWrapped<string>) {
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
