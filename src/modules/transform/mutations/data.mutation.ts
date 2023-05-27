import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Data } from '../../../wrappers/data.wrapper';
import { DataType } from '../../../wrappers/data-type.wrapper';
import { Text } from '../../../wrappers/text.wrapper';
import { DataTransformation } from '../data-transformation';
import {
  dataToCsv,
  dataToJson,
  dataToYaml,
  transform,
} from '../utils/transformer.utils';

declare module '../../../wrappers/data.wrapper' {
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
