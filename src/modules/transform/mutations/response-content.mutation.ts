import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { csvToData, yamlToData } from '../transformer';
import { Markdown } from '../../data/markdown';
import { ResponseContent } from '../../web/response-content';
import { Text } from '../../data/text';
import { DataFormat } from '../../data/data-format';

declare module '../../web/response-content' {
  interface ResponseContent {
    get json(): Data;

    get yaml(): Data;

    get csv(): Data;

    get html(): Text;

    get xml(): Text;

    get md(): Markdown;
  }
}

mutateClass(
  ResponseContent,
  definePropertiesMutation({
    json: {
      get(): Data<any> {
        return Data.create(this.value);
      },
    },

    yaml: {
      get(): Data<any> {
        return yamlToData(this.text);
      },
    },

    csv: {
      get(): Data<any> {
        return csvToData(this.text);
      },
    },

    html: {
      get(): Text {
        return Text.create(this.text, DataFormat.Html);
      },
    },

    xml: {
      get(): Text {
        return Text.create(this.text, DataFormat.Xml);
      },
    },

    md: {
      get(): Markdown {
        return Markdown.create(this.text);
      },
    },
  }),
);
