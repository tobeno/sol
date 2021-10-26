import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { editor } from './editor';
import { spawnSync } from 'child_process';
import { Item } from '../storage/item';

declare module '../storage/item' {
  interface Item {
    edit(): Item;
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
  }),
);
