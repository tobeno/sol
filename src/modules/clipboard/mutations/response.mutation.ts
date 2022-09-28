import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { getClipboard } from '../clipboard';
import { Response } from '../../web/response';

declare module '../../web/response' {
  interface Response {
    copy(): this;
  }
}

mutateClass(
  Response,
  definePropertiesMutation({
    copy: {
      value(): any {
        getClipboard().text = this.serializable.json;

        return this;
      },
    },
  }),
);
