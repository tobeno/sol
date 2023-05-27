import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { Markdown } from '../../../wrappers/markdown';
import { Text } from '../../../wrappers/text';
import { markdownToHtml } from '../utils/transformer';

declare module '../../../wrappers/markdown' {
  interface Markdown {
    /**
     * Returns the Markdown as HTML.
     */
    get html(): Text;
  }
}

mutateClass(
  Markdown,
  definePropertiesMutation({
    html: {
      get(): Text {
        return markdownToHtml(this.value);
      },
    },
  }),
);
