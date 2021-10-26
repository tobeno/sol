import { definePropertiesMutation, mutateClass } from './mutation';
import { Data } from '../data/data';
import { log } from './log';

declare module '../data/data' {
  interface Data {
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
