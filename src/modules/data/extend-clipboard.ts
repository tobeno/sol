import { Data } from './data';
import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { Clipboard } from '../os/clipboard';
import {
  csvToData,
  jsonToData,
  unwrapString,
  wrapString,
  yamlToData,
} from './transformer';

declare module '../os/clipboard' {
  interface Clipboard {
    get text(): any;

    set text(value: any);

    get json(): Data;

    get yaml(): Data;

    get csv(): Data;
  }
}

mutateClass(
  Clipboard,
  definePropertiesMutation({
    text: {
      get(): any {
        return wrapString(this.value, null, this);
      },

      set(value: any) {
        this.value = unwrapString(value);
      },
    },

    json: {
      get(): Data {
        console.log('X');

        return jsonToData(this.text);
      },
    },

    yaml: {
      get(): Data {
        return yamlToData(this.text);
      },
    },

    csv: {
      get(): Data {
        return csvToData(this.text);
      },
    },
  }),
);
