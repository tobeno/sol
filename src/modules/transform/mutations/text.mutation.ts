import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { codeToAst, csvToData, jsonToData, yamlToData } from '../transformer';
import { Text } from '../../data/text';
import { Url } from '../../data/url';
import { Ast } from '../../data/ast';
import { Markdown } from '../../data/markdown';
import { DataFormat } from '../../data/data-format';

declare module '../../data/text' {
  interface Text<ContentType> {
    get json(): Data<ContentType>;

    get yaml(): Data<ContentType>;

    get csv(): Data<ContentType>;

    get ast(): Ast;

    get url(): Url;

    get html(): Text<any>;

    get md(): Markdown;
  }
}

mutateClass(
  Text,
  definePropertiesMutation({
    json: {
      get(): Data<any> {
        return jsonToData(this);
      },
    },

    yaml: {
      get(): Data<any> {
        return yamlToData(this);
      },
    },

    csv: {
      get(): Data<any> {
        return csvToData(this);
      },
    },

    ast: {
      get(): Ast {
        return codeToAst(this);
      },
    },

    url: {
      get(): Url {
        return Url.create(this);
      },
    },

    html: {
      get(): Text {
        return Text.create(this, DataFormat.Html);
      },
    },

    md: {
      get(): Markdown {
        return Markdown.create(this);
      },
    },
  }),
);
