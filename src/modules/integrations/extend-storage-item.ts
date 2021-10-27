import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { Item } from '../storage/item';
import { browse } from './browser';
import { open } from './open';

declare module '../storage/item' {
  interface Item {
    edit(): Item;

    browse(): Item;

    open(app?: string): Item;
  }
}

mutateClass(
  Item,
  definePropertiesMutation({
    edit: {
      value(): Item {
        open(this.uri, process.env.SOL_EDITOR || 'code');

        return this;
      },
    },
    browse: {
      value(): Item {
        browse(this.uri);

        return this;
      },
    },
    open: {
      value(app?: string): Item {
        open(this.uri, app);

        return this;
      },
    },
  }),
);
