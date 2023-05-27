import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { Markdown } from '../../../wrappers/markdown.wrapper';
import { Text } from '../../../wrappers/text.wrapper';
import { markdownToHtml } from '../utils/transformer.utils';

declare module '../../../wrappers/markdown.wrapper' {
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
