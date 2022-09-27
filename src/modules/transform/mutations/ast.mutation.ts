import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { astToCode, dataToJson, dataToYaml } from '../transformer';
import { Text } from '../../data/text';
import { Ast } from '../../data/ast';

declare module '../../data/ast' {
  interface Ast {
    get code(): Text;

    get json(): Text;

    get yaml(): Text;
  }
}

mutateClass(
  Ast,
  definePropertiesMutation({
    code: {
      get(): Text {
        return astToCode(this);
      },
    },

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
