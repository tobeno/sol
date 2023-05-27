import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Ast } from '../../../wrappers/ast.wrapper';
import { DataType } from '../../../wrappers/data-type.wrapper';
import { Data } from '../../../wrappers/data.wrapper';
import { Html } from '../../../wrappers/html.wrapper';
import { Markdown } from '../../../wrappers/markdown.wrapper';
import { Text } from '../../../wrappers/text.wrapper';
import { Url } from '../../../wrappers/url.wrapper';
import { Xml } from '../../../wrappers/xml.wrapper';
import { Graph } from '../../visualize/wrappers/graph.wrapper';
import { DataTransformation } from '../data-transformation';
import {
  codeToAst,
  csvToData,
  jsonToData,
  transform,
  yamlToData,
} from '../utils/transformer.utils';

declare module '../../../wrappers/text.wrapper' {
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
