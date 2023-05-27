import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Response } from '../../../wrappers/response.wrapper';
import { Text } from '../../../wrappers/text.wrapper';

declare module '../../../wrappers/response.wrapper' {
  interface Response {
    /**
     * Returns the response as JSON.
     */
    get json(): Text;

    /**
     * Returns the response as YAML.
     */
    get yaml(): Text;
  }
}

mutateClass(
  Response,
  definePropertiesMutation({
    json: {
      get(): Text {
        return this.serializable.json;
      },
    },

    yaml: {
      get(): Text {
        return this.serializable.yaml;
      },
    },
  }),
);
