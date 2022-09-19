import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { dataToJson, dataToYaml } from '../transformer';
import { Text } from '../../data/text';
import { Response } from '../../web/response';

declare module '../../web/response' {
  interface Response {
    get json(): Text;

    get yaml(): Text;
  }
}

mutateClass(
  Response,
  definePropertiesMutation({
    json: {
      get(): Text {
        return dataToJson(this.value);
      },
    },

    yaml: {
      get(): Text {
        return dataToYaml(this.value);
      },
    },
  }),
);
