import type { MaybeWrapped } from '../../interfaces/wrapper.interfaces';
import { Text } from '../../wrappers/text.wrapper';
import module from 'node:module';

const require = module.createRequire(import.meta.url);

/**
 * Class for interacting with the OS clipboard.
 */
export class Clipboard {
  static readonly usageHelp = `
> clipboard.text = 'Hello, world!'
> clipboard.text.uppercased
> clipboard.json = { a: 1, b: 2 }
> clipboard.json.keys
  `.trim();

  /**
   * Returns the clipboard contents as a string.
   */
  get value(): string {
    const clipboardy = require('clipboardy').default;
    return clipboardy.readSync();
  }

  /**
   * Sets the clipboard contents.
   */
  set value(value: MaybeWrapped<string>) {
    const clipboardy = require('clipboardy').default;
    clipboardy.writeSync(String(value));
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

  static create(): Clipboard {
    const result = new Clipboard();

    return withHelp(
      result,
      `
Wrapper for the system clipboard.

Usage:
${Clipboard.usageHelp}
    `,
    );
  }
}

let clipboard: Clipboard | null = null;

export function getClipboard(): Clipboard {
  if (!clipboard) {
    clipboard = Clipboard.create();
  }

  return clipboard;
}
