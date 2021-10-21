import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { Data } from '../data/data';
import { log } from './log';

declare module '../data/text' {
  interface Text {
    log(): void;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    log: {
      value(): void {
        log(String(this));
      },
    },
  }),
);
