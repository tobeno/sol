import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Text } from '../../data/text';

declare global {
  interface String {
    /**
     * Returns the a wrapped Text for the string.
     */
    get text(): Text;
  }
}

mutateClass(
  String,
  definePropertiesMutation({
    text: {
      get() {
        return Text.create(String(this));
      },
    },
  }),
);
