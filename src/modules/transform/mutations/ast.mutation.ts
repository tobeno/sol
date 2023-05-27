import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Ast } from '../../../wrappers/ast';
import { Text } from '../../../wrappers/text';
import { astToCode, dataToJson, dataToYaml } from '../utils/transformer';

declare module '../../../wrappers/ast' {
  interface Ast {
    /**
     * Returns the code that the AST represents.
     */
    get code(): Text;

    /**
     * Returns the AST as a JSON string.
     */
    get json(): Text;

    /**
     * Returns the AST as a YAML string.
     */
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
