export class Clipboard {
  get value(): string {
    return require('clipboardy').readSync();
  }

  set value(value: any) {
    require('clipboardy').writeSync(value);
  }
}

let clipboard: Clipboard | null = null;

export function getClipboard(): Clipboard {
  if (!clipboard) {
    clipboard = new Clipboard();
  }

  return clipboard;
}
