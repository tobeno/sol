import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Data } from '../../data/data';
import { getClipboard } from '../clipboard';

declare module '../../data/data' {
  interface Data {
    copy(): this;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    copy: {
      value(): any {
        getClipboard().text = String(this);

        return this;
      },
    },
  }),
);
