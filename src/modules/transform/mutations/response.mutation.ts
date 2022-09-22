import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Text } from '../../data/text';
import { Response } from '../../web/response';

declare module '../../web/response' {
  interface Response {
    get json(): Data;

    get yaml(): Data;
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
