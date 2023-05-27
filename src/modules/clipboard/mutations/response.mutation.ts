import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Response } from '../../../wrappers/response.wrapper';
import { getClipboard } from '../clipboard';

declare module '../../../wrappers/response.wrapper' {
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
