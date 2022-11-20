import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { dataToCsv, dataToJson, dataToYaml } from '../transformer';
import { Text } from '../../data/text';

declare global {
  interface Array<T> {
    /**
     * Returns the array as a JSON string.
     */
    get json(): Text;

    /**
     * Returns the array as a YAML string.
     */
    get yaml(): Text;

    /**
     * Returns the array as a CSV string.
     */
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
