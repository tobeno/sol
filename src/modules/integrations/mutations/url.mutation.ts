import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { open } from '../../../utils/open.utils';
import { Url } from '../../../wrappers/url.wrapper';
import { browse } from '../utils/browser.utils';
import { edit } from '../utils/editor.utils';

declare module '../../../wrappers/url.wrapper' {
  interface Url {
    /**
     * Opens the URL in the default browser.
     */
    edit(): this;

    /**
     * Opens the URL in the default browser.
     */
    browse(): this;

    /**
     * Opens the URL in the default or given app.
     */
    open(app?: string): this;
  }
}

mutateClass(
  Url,
  definePropertiesMutation({
    browse: {
      value(): Url {
        browse(this.value);

        return this;
      },
    },
    edit: {
      value(): Url {
        edit(this.value);

        return this;
      },
    },
    open: {
      value(app?: string): Url {
        open(this.value, app);

        return this;
      },
    },
  }),
);
