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

export const clipboard = new Clipboard();
