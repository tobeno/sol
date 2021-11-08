import clipboardy from 'clipboardy';

export class Clipboard {
  get value(): string {
    return clipboardy.readSync();
  }

  set value(value: any) {
    clipboardy.writeSync(value);
  }
}

let clipboard: Clipboard | null = null;

export function getClipboard(): Clipboard {
  if (!clipboard) {
    clipboard = new Clipboard();
  }

  return clipboard;
}
