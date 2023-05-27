import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Ast } from '../../../wrappers/ast.wrapper';
import { Text } from '../../../wrappers/text.wrapper';
import { astToCode, dataToJson, dataToYaml } from '../utils/transformer.utils';

declare module '../../../wrappers/ast.wrapper' {
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
