import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Clipboard } from '../../os/clipboard';
import { csvToData, jsonToData, yamlToData } from '../transformer';
import { Url } from '../../data/url';
import { Text } from '../../data/text';

declare module '../../os/clipboard' {
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
        return Text.create(this.value);
      },

      set(value: any) {
        this.value = String(value);
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
        return Url.create(this.text);
      },
    },
  }),
);
