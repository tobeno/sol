import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import {
  codeToAst,
  csvToData,
  jsonToData,
  transform,
  yamlToData,
} from '../transformer';
import { Text } from '../../data/text';
import { Url } from '../../web/url';
import { Ast } from '../../data/ast';
import { Markdown } from '../../data/markdown';
import { Html } from '../../data/html';
import { Xml } from '../../data/xml';
import { DataType } from '../../data/data-type';
import { DataTransformation } from '../data-transformation';

declare module '../../data/text' {
  interface Text {
    get json(): Data;

    get yaml(): Data;

    get csv(): Data;

    get ast(): Ast;

    get url(): Url;

    get html(): Html;

    get xml(): Xml;

    get md(): Markdown;

    to(type: DataType | string): any;
  }
}

mutateClass(
  Text,
  definePropertiesMutation({
    json: {
      get(): Data {
        return jsonToData(this);
      },
    },

    yaml: {
      get(): Data {
        return yamlToData(this);
      },
    },

    csv: {
      get(): Data {
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
      get(): Html {
        return Html.create(this);
      },
    },

    md: {
      get(): Markdown {
        return Markdown.create(this);
      },
    },

    to: {
      value(targetType: DataType | string): any {
        if (typeof targetType === 'string') {
          targetType = DataType.fromString(targetType);
        }

        return transform(
          this,
          new DataTransformation(new DataType('Text', this.format), targetType),
        );
      },
    },
  }),
);
