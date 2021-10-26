import { definePropertiesMutation, mutateClass } from './mutation';
import { Clipboard } from '../os/clipboard';
import { log } from './log';

declare module '../os/clipboard' {
  interface Clipboard {
    log(): void;
  }
}

mutateClass(
  Clipboard,
  definePropertiesMutation({
    log: {
      value(): void {
        return log(this.text);
      },
    },
  }),
);
