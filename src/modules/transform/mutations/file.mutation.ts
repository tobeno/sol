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
import { DataFormat } from '../../data/data-format';

declare module '../../storage/file' {
  interface File<ContentType = any> {
    get json(): Data<ContentType>;

    set json(value: Data<ContentType> | any);

    get yaml(): Data<ContentType>;

    set yaml(value: Data<ContentType> | any);

    get csv(): Data<ContentType>;

    set csv(value: Data<ContentType> | any);

    get ast(): Ast;

    set ast(value: Ast | any);

    get md(): Markdown;

    set md(value: Markdown | any);
  }
}

mutateClass(
  File,
  definePropertiesMutation({
    json: {
      get(): Data<any> {
        return jsonToData(this.text);
      },
      set(value: Data<any>): void {
        this.text = dataToJson(value);
      },
    },

    yaml: {
      get(): Data<any> {
        return yamlToData(this.text);
      },
      set(value: Data<any>) {
        this.text = dataToYaml(value);
      },
    },

    csv: {
      get(): Data<any> {
        return csvToData(this.text);
      },
      set(value: Data<any>) {
        this.text = dataToCsv(value);
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

    html: {
      get(): any {
        return Text.create(this.text, DataFormat.Html);
      },

      set(value: any) {
        this.text = String(value);
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
