import { MaybeWrapped } from '../../../interfaces/data.interfaces';
import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Ast } from '../../../wrappers/ast.wrapper';
import { Data } from '../../../wrappers/data.wrapper';
import { File } from '../../../wrappers/file.wrapper';
import { Html } from '../../../wrappers/html.wrapper';
import { Markdown } from '../../../wrappers/markdown.wrapper';
import { Xml } from '../../../wrappers/xml.wrapper';
import {
  astToCode,
  codeToAst,
  csvToData,
  dataToCsv,
  dataToJson,
  dataToYaml,
  jsonToData,
  yamlToData,
} from '../utils/transformer.utils';

declare module '../../../wrappers/file.wrapper' {
  interface File {
    /**
     * Loads the file contents as JSON.
     */
    get json(): Data;

    /**
     * Sets the data as JSON in the file.
     */
    set json(value: Data | any);

    /**
     * Loads the file contents as YAML.
     */
    get yaml(): Data;

    /**
     * Sets the data as YAML in the file.
     */
    set yaml(value: Data | any);

    /**
     * Loads the file contents as CSV.
     */
    get csv(): Data;

    /**
     * Sets the data as CSV in the file.
     */
    set csv(value: Data | any);

    /**
     * Parses the file contents to an AST.
     */
    get ast(): Ast;

    /**
     * Sets the AST code in the file.
     */
    set ast(value: Ast | any);

    /**
     * Loads the file contents as HTML.
     */
    get html(): Html;

    /**
     * Sets the HTML in the file.
     */
    set html(value: Html | MaybeWrapped<string>);

    /**
     * Loads the file contents as XML.
     */
    get xml(): Xml;

    /**
     * Sets the XML in the file.
     */
    set xml(value: Xml | MaybeWrapped<string>);

    /**
     * Loads the file contents as Markdown.
     */
    get md(): Markdown;

    /**
     * Sets the Markdown in the file.
     */
    set md(value: Markdown | MaybeWrapped<string>);
  }
}

mutateClass(
  File,
  definePropertiesMutation({
    json: {
      get(): Data {
        return jsonToData(this.text);
      },
      set(value: Data | any) {
        this.text = dataToJson(value);
      },
    },

    yaml: {
      get(): Data {
        return yamlToData(this.text);
      },
      set(value: Data | any) {
        this.text = dataToYaml(value);
      },
    },

    csv: {
      get(): Data {
        return csvToData(this.text);
      },
      set(value: Data | any) {
        this.text = dataToCsv(value);
      },
    },

    ast: {
      get(): Ast {
        return codeToAst(this.text);
      },
      set(value: Ast | any) {
        this.text = astToCode(value);
      },
    },

    html: {
      get(): Html {
        return Html.create(this.text);
      },

      set(value: Html | MaybeWrapped<string>) {
        this.text = String(value);
      },
    },

    xml: {
      get(): Xml {
        return Xml.create(this.text);
      },

      set(value: Xml | MaybeWrapped<string>) {
        this.text = String(value);
      },
    },

    md: {
      get(): Markdown {
        return Markdown.create(this.text);
      },
      set(value: Markdown | MaybeWrapped<string>) {
        this.text = Markdown.create(value).text;
      },
    },
  }),
);
