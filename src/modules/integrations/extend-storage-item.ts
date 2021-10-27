import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { editor } from './editor';
import { spawnSync } from 'child_process';
import { Item } from '../storage/item';
import { browse } from './browser';

declare module '../storage/item' {
  interface Item {
    edit(): Item;

    browse(): Item;
  }
}

mutateClass(
  Item,
  definePropertiesMutation({
    edit: {
      value(): Item {
        spawnSync(`${editor} '${this.path}'`, {
          cwd: process.cwd(),
          shell: true,
        });

        return this;
      },
    },
    browse: {
      value(): Item {
        browse(this.uri);

        return this;
      },
    },
  }),
);
