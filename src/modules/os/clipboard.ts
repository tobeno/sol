import { readSync, writeSync } from 'clipboardy';

export class Clipboard {
  get value(): string {
    return readSync();
  }

  set value(value: any) {
    writeSync(value);
  }

  log() {
    console.log(String(this));
  }
}

export const clipboard = new Clipboard();
