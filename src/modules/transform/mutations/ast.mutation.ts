import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';
import { dataToJson, dataToYaml } from '../transformer';
import { Text } from '@sol/modules/data/text';
import { Ast } from '@sol/modules/data/ast';

declare module '../../data/ast' {
  interface Ast {
    get json(): Text;

    get yaml(): Text;
  }
}

mutateClass(
  Ast,
  definePropertiesMutation({
    json: {
      get(): Text {
        return dataToJson(this.value);
      },
    },

    yaml: {
      get(): Text {
        return dataToYaml(this.value);
      },
    },
  }),
);
