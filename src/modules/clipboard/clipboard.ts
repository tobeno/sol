import { Text } from '../data/text';

export class Clipboard {
  get value(): string {
    return require('clipboardy').readSync();
  }

  set value(value: any) {
    require('clipboardy').writeSync(value);
  }

  get text(): Text {
    return Text.create(this.value);
  }

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
