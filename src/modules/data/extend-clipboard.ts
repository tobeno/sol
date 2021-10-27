import { Data } from './data';
import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { Clipboard } from '../os/clipboard';
import {
  csvToData,
  jsonToData,
  textToUrl,
  unwrapString,
  wrapString,
  yamlToData,
} from './transformer';
import { Url } from './url';

declare module '../os/clipboard' {
  interface Clipboard {
    get text(): any;

    set text(value: any);

    get json(): Data;

    get yaml(): Data;

    get csv(): Data;

    get url(): Url;
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

    url: {
      get(): Url {
        return textToUrl(this.text);
      },
    },
  }),
);
