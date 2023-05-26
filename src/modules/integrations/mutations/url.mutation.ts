import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Url } from '../../web/url';
import { browse } from '../browser';
import { open } from '../../../utils/open';

declare module '../../web/url' {
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
