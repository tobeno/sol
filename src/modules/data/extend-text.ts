import { Data } from './data';
import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import {
  codeToAst,
  csvToData,
  jsonToData,
  wrapHtml,
  wrapUrl,
  yamlToData,
} from './transformer';
import { Text } from './text';
import { Url } from './url';
import { Ast } from './ast';
import { Html } from './html';

declare module './text' {
  interface Text<ContentType> {
    get json(): Data<ContentType>;

    get yaml(): Data<ContentType>;

    get csv(): Data<ContentType>;

    get ast(): Ast;

    get html(): Html;

    get url(): Url;
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

    html: {
      get(): Html {
        return wrapHtml(this);
      },
    },

    url: {
      get(): Url {
        return wrapUrl(this);
      },
    },
  }),
);
