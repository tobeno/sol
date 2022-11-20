import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Text } from '../../data/text';
import { Response } from '../../web/response';
import { Html } from '../../data/html';

declare module '../../web/response' {
  interface Response {
    /**
     * Returns the response as JSON.
     */
    get json(): Text;

    /**
     * Returns the response as YAML.
     */
    get yaml(): Text;

    /**
     * Returns the response as HTML.
     */
    get html(): Html;
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

    html: {
      get(): Html {
        return this.content.html;
      },
    },
  }),
);
