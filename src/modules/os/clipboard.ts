import clipboardy from 'clipboardy';

export class Clipboard {
  get value(): string {
    return clipboardy.readSync();
  }

  set value(value: any) {
    clipboardy.writeSync(value);
  }

  log() {
    console.log(String(this));
  }
}

export const clipboard = new Clipboard();
