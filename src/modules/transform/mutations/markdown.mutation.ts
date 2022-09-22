import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { markdownToHtml } from '../transformer';
import { Text } from '../../data/text';
import { Markdown } from '../../data/markdown';

declare module '../../data/markdown' {
  interface Markdown {
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
