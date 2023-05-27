import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Response } from '../../../wrappers/response';
import { Text } from '../../../wrappers/text';

declare module '../../../wrappers/response' {
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
