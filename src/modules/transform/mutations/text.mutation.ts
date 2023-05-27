import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Ast } from '../../../wrappers/ast';
import { Data } from '../../../wrappers/data';
import { DataType } from '../../../wrappers/data-type';
import { Html } from '../../../wrappers/html';
import { Markdown } from '../../../wrappers/markdown';
import { Text } from '../../../wrappers/text';
import { Url } from '../../../wrappers/url';
import { Xml } from '../../../wrappers/xml';
import { Graph } from '../../visualize/wrappers/graph';
import { DataTransformation } from '../data-transformation';
import {
  codeToAst,
  csvToData,
  jsonToData,
  transform,
  yamlToData,
} from '../utils/transformer';

declare module '../../../wrappers/text' {
  interface Text {
    /**
     * Parses the text as JSON.
     */
    get json(): Data;

    /**
     * Parses the text as YAML.
     */
    get yaml(): Data;

    /**
     * Parses the text as CSV.
     */
    get csv(): Data;

    /**
     * Parses the code as AST.
     */
    get ast(): Ast;

    /**
     * Loads the text as URL.
     */
    get url(): Url;

    /**
     * Loads the text as HTML.
     */
    get html(): Html;

    /**
     * Loads the text as XML.
     */
    get xml(): Xml;

    /**
     * Loads the text as Markdown.
     */
    get md(): Markdown;

    /**
     * Loads the text as Mermaid graph.
     */
    get graph(): Graph;

    /**
     * Converts the text to the specified data type.
     */
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

    xml: {
      get(): Html {
        return Xml.create(this);
      },
    },

    md: {
      get(): Markdown {
        return Markdown.create(this);
      },
    },

    graph: {
      get(): Graph {
        return Graph.create(this);
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
