import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';
import { Data } from '../../data/data';
import { getClipboard } from '../clipboard';

declare module '../../data/data' {
  interface Data {
    copy(): void;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    copy: {
      value(): void {
        getClipboard().text = String(this);
      },
    },
  }),
);
