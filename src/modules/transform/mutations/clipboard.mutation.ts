import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Clipboard } from '../../clipboard/clipboard';
import {
  astToCode,
  codeToAst,
  csvToData,
  jsonToData,
  yamlToData,
} from '../transformer';
import { Url } from '../../data/url';
import { Text } from '../../data/text';
import { Ast } from '../../data/ast';
import { Markdown } from '../../data/markdown';
import { DataFormat } from '../../global/classes';

declare module '../../clipboard/clipboard' {
  interface Clipboard {
    get json(): Data;

    set json(value: Data | any);

    get yaml(): Data;

    set yaml(value: Data | any);

    get csv(): Data;

    set csv(value: Data | any);

    get ast(): Ast;

    set ast(value: Ast | any);

    get url(): Url;

    set url(value: Url | Text | string);

    get html(): Text;

    set html(value: Text | string);

    get md(): Markdown;

    set md(value: Markdown | Text | string);
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

      set(value: Url | Text | string) {
        this.text = Url.create(value).text;
      },
    },

    html: {
      get(): Text {
        return Text.create(this.value, DataFormat.Html);
      },

      set(value: Text | string) {
        this.value = String(value);
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
