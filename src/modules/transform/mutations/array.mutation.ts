import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { dataToCsv, dataToJson, dataToYaml } from '../transformer';
import { Text } from '../../data/text';
import { Data } from '../../data/data';

declare global {
  interface Array<T> {
    /**
     * Returns the array wrapped as Data.
     */
    get data(): Data<Array<T>>;

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
    data: {
      get() {
        return Data.create(this);
      },
    },
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
