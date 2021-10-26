import { Data } from './data';
import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { csvToData, jsonToData, yamlToData } from './transformer';
import { Text } from './text';

declare module './text' {
  interface Text<ContentType> {
    get json(): Data<ContentType>;

    get yaml(): Data<ContentType>;

    get csv(): Data<ContentType>;
  }
}

mutateClass(
  Text,
  definePropertiesMutation({
    json: {
      get(): Data<any> {
        return jsonToData(this);
      },
    },

    yaml: {
      get(): Data<any> {
        return yamlToData(this);
      },
    },

    csv: {
      get(): Data<any> {
        return csvToData(this);
      },
    },
  }),
);
