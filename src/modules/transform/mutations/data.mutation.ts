import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { dataToCsv, dataToJson, dataToYaml, transform } from '../transformer';
import { Text } from '../../data/text';
import { DataType } from '../../data/data-type';
import { DataTransformation } from '../data-transformation';

declare module '../../data/data' {
  interface Data {
    /**
     * Returns the data as text.
     */
    get text(): Text;

    /**
     * Returns the data as a JSON string.
     */
    get json(): Text;

    /**
     * Returns the data as a YAML string.
     */
    get yaml(): Text;

    /**
     * Returns the data as a CSV string.
     */
    get csv(): Text;

    /**
     * Returns the data as the given data type.
     */
    to(type: DataType | string): any;
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

    to: {
      value(targetType: DataType | string): any {
        if (typeof targetType === 'string') {
          targetType = DataType.fromString(targetType);
        }

        return transform(
          this,
          new DataTransformation(new DataType('Data'), targetType),
        );
      },
    },
  }),
);
