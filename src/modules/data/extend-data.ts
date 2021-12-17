import { Data } from './data';
import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { dataToCsv, dataToJson, dataToYaml } from './transformer';
import { Text, wrapString } from './text';

declare module './data' {
  interface Data {
    get text(): any;

    get json(): Text;

    get yaml(): Text;

    get csv(): Text;
  }
}

mutateClass(
  Data,
  definePropertiesMutation({
    text: {
      get(): any {
        let value = this.value as any;
        if (!(value instanceof Text) && typeof value !== 'string') {
          value = this.json;
        }

        return wrapString(value, null, this);
      },
    },

    json: {
      get(): Text<any> {
        return dataToJson<any>(this);
      },
    },

    yaml: {
      get(): Text<any> {
        return dataToYaml<any>(this);
      },
    },

    csv: {
      get(): Text<any> {
        return dataToCsv<any>(this);
      },
    },
  }),
);
