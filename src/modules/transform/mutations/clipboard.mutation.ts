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
    get text(): Text;

    set text(value: Text | string);

    get json(): Data;

    set json(value: Data | Record<string, any>);

    get yaml(): Data;

    set yaml(value: Data | Record<string, any>);

    get csv(): Data;

    set csv(value: Data | Record<string, any>);

    get ast(): Ast;

    set ast(value: Ast);

    get url(): Url;

    set url(value: Url | string);

    get html(): Text;

    set html(value: Text | string);

    get md(): Markdown;

    set md(value: Markdown);
  }
}

mutateClass(
  Clipboard,
  definePropertiesMutation({
    text: {
      get(): any {
        return Text.create(this.value);
      },

      set(value: any) {
        this.value = String(value);
      },
    },

    json: {
      get(): Data {
        return jsonToData(this.text);
      },

      set(value: Data) {
        this.text = Data.create(value).json;
      },
    },

    yaml: {
      get(): Data {
        return yamlToData(this.text);
      },

      set(value: Data) {
        this.text = Data.create(value).yaml;
      },
    },

    csv: {
      get(): Data {
        return csvToData(this.text);
      },

      set(value: Data) {
        this.text = Data.create(value).csv;
      },
    },

    ast: {
      get(): Ast {
        return codeToAst(this.text);
      },

      set(value: Ast) {
        this.text = astToCode(value);
      },
    },

    url: {
      get(): Url {
        return Url.create(this.text);
      },

      set(value: Url) {
        this.text = value.text;
      },
    },

    html: {
      get(): any {
        return Text.create(this.value, DataFormat.Html);
      },

      set(value: any) {
        this.value = String(value);
      },
    },

    md: {
      get(): Markdown {
        return Markdown.create(this.text);
      },

      set(value: Markdown) {
        this.text = value.text;
      },
    },
  }),
);
