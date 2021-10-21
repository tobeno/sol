import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { Data } from '../data/data';
import { clipboard } from './clipboard';

declare module '../data/data' {
  interface Data {
    copy(): void;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    copy: {
      value(): void {
        clipboard.text = String(this);
      },
    },
  }),
);
