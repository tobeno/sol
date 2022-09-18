import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';
import { edit } from '../editor';
import { Url } from '../../data/url';
import { browse } from '../browser';
import { open } from '../open';

declare module '../../data/url' {
  interface Url {
    edit(): Url;

    browse(): Url;

    open(app?: string): Url;
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
