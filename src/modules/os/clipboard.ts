import * as clipboardy from 'clipboardy';

export class Clipboard {
  get value(): string {
    return clipboardy.readSync();
  }

  set value(value: any) {
    clipboardy.writeSync(value);
  }
}

export const clipboard = new Clipboard();
