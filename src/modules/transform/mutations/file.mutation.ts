import { Data } from '../../data/data';
import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';
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

declare module '../../storage/file' {
  interface File<ContentType = any> {
    get json(): Data<ContentType>;

    set json(value: Data<ContentType>);

    get yaml(): Data<ContentType>;

    set yaml(value: Data<ContentType>);

    get csv(): Data<ContentType>;

    set csv(value: Data<ContentType>);

    get ast(): Ast;

    set ast(value: Ast);
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
  }),
);
