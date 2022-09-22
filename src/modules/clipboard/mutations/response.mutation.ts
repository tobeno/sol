import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { getClipboard } from '../clipboard';
import { Response } from '../../web/response';

declare module '../../web/response' {
  interface Response {
    copy(): void;
  }
}

mutateClass(
  Response,
  definePropertiesMutation({
    copy: {
      value(): void {
        getClipboard().text = this.serializable.json;
      },
    },
  }),
);
