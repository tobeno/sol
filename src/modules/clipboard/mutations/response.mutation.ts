import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Response } from '../../../wrappers/response';
import { getClipboard } from '../clipboard';

declare module '../../../wrappers/response' {
  interface Response {
    /**
     * Copies the response to the clipboard.
     */
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
