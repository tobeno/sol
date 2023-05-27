import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { open } from '../../../utils/open';
import { Url } from '../../../wrappers/url';
import { browse } from '../utils/browser';
import { edit } from '../utils/editor';

declare module '../../../wrappers/url' {
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
