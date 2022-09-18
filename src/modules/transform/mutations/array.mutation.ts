import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';
import { dataToCsv, dataToJson, dataToYaml } from '../transformer';
import { Text } from '../../data/text';

declare global {
  interface Array<T> {
    get json(): Text;

    get yaml(): Text;

    get csv(): Text;
  }
}

mutateClass(
  Array,
  definePropertiesMutation({
    csv: {
      get() {
        return dataToCsv(this);
      },
    },
    json: {
      get() {
        return dataToJson(this);
      },
    },
    yaml: {
      get() {
        return dataToYaml(this);
      },
    },
  }),
);
