import { MaybeWrapped } from '../../../interfaces/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Ast } from '../../../wrappers/ast';
import { Data } from '../../../wrappers/data';
import { Html } from '../../../wrappers/html';
import { Markdown } from '../../../wrappers/markdown';
import { Url } from '../../../wrappers/url';
import { Xml } from '../../../wrappers/xml';
import { Clipboard } from '../../clipboard/clipboard';
import {
  astToCode,
  codeToAst,
  csvToData,
  jsonToData,
  yamlToData,
} from '../utils/transformer';

declare module '../../clipboard/clipboard' {
  interface Clipboard {
    /**
     * Loads the clipboard contents as JSON.
     */
    get json(): Data;

    /**
     * Sets the data as JSON in the clipboard.
     */
    set json(value: Data | any);

    /**
     * Loads the clipboard contents as YAML.
     */
    get yaml(): Data;

    /**
     * Sets the data as YAML in the clipboard.
     */
    set yaml(value: Data | any);

    /**
     * Loads the clipboard contents as CSV.
     */
    get csv(): Data;

    /**
     * Sets the data as CSV in the clipboard.
     */
    set csv(value: Data | any);

    /**
     * Loads the clipboard contents as AST.
     */
    get ast(): Ast;

    /**
     * Sets the AST code in the clipboard.
     */
    set ast(value: Ast | any);

    /**
     * Loads the clipboard contents as URL.
     */
    get url(): Url;

    /**
     * Sets the URL in the clipboard.
     */
    set url(value: Url | MaybeWrapped<string>);

    /**
     * Loads the clipboard contents as HTML.
     */
    get html(): Html;

    /**
     * Sets the HTML in the clipboard.
     */
    set html(value: Html | MaybeWrapped<string>);

    /**
     * Loads the clipboard contents as XML.
     */
    get xml(): Xml;

    /**
     * Sets the XML in the clipboard.
     */
    set xml(value: Xml | MaybeWrapped<string>);

    /**
     * Loads the clipboard contents as Markdown.
     */
    get md(): Markdown;

    /**
     * Sets the Markdown in the clipboard.
     */
    set md(value: Markdown | MaybeWrapped<string>);
  }
}

mutateClass(
  Clipboard,
  definePropertiesMutation({
    json: {
      get(): Data {
        return jsonToData(this.text);
      },

      set(value: Data | any) {
        this.text = Data.create(value).json;
      },
    },

    yaml: {
      get(): Data {
        return yamlToData(this.text);
      },

      set(value: Data | any) {
        this.text = Data.create(value).yaml;
      },
    },

    csv: {
      get(): Data {
        return csvToData(this.text);
      },

      set(value: Data | any) {
        this.text = Data.create(value).csv;
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

    url: {
      get(): Url {
        return Url.create(this.text);
      },

      set(value: Url | MaybeWrapped<string>) {
        this.text = Url.create(value).text;
      },
    },

    html: {
      get(): Html {
        return Html.create(this.text);
      },

      set(value: Html | MaybeWrapped<string>) {
        this.value = String(value);
      },
    },

    xml: {
      get(): Xml {
        return Xml.create(this.text);
      },

      set(value: Xml | MaybeWrapped<string>) {
        this.value = String(value);
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
