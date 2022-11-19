import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import {
  astToCode,
  codeToAst,
  csvToData,
  dataToCsv,
  dataToJson,
  dataToYaml,
  jsonToData,
  yamlToData,
} from '../transformer';
import { File } from '../../storage/file';
import { Ast } from '../../data/ast';
import { Markdown } from '../../data/markdown';
import { Text } from '../../data/text';
import { Html } from '../../data/html';
import { Xml } from '../../data/xml';

declare module '../../storage/file' {
  interface File {
    get json(): Data;

    set json(value: Data | any);

    get yaml(): Data;

    set yaml(value: Data | any);

    get csv(): Data;

    set csv(value: Data | any);

    get ast(): Ast;

    set ast(value: Ast | any);

    get html(): Html;

    set html(value: Html | Text | string);

    get xml(): Xml;

    set xml(value: Xml | Text | string);

    get md(): Markdown;

    set md(value: Markdown | Text | string);
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

      set(value: Html | Text | string) {
        this.text = String(value);
      },
    },

    xml: {
      get(): Xml {
        return Xml.create(this.text);
      },

      set(value: Xml | Text | string) {
        this.text = String(value);
      },
    },

    md: {
      get(): Markdown {
        return Markdown.create(this.text);
      },
      set(value: Markdown | Text | string) {
        this.text = Markdown.create(value).text;
      },
    },
  }),
);
