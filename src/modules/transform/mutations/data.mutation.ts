import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { dataToCsv, dataToJson, dataToYaml } from '../transformer';
import { Text } from '../../data/text';

declare module '../../data/data' {
  interface Data {
    get text(): Text;

    get json(): Text;

    get yaml(): Text;

    get csv(): Text;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    text: {
      get(): Text {
        let value = this.value as any;
        if (!(value instanceof Text) && typeof value !== 'string') {
          value = this.json;
        }

        return Text.create(value);
      },
    },

    json: {
      get(): Text {
        return dataToJson(this);
      },
    },

    yaml: {
      get(): Text {
        return dataToYaml(this);
      },
    },

    csv: {
      get(): Text {
        return dataToCsv(this);
      },
    },
  }),
);
