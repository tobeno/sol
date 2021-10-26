import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { Extension } from '../sol/extension';
import { Item } from '../storage/item';

declare module '../sol/extension' {
  interface Extension {
    edit(): Item;
  }
}

mutateClass(
  Extension,
  definePropertiesMutation({
    edit: {
      value(): Item {
        this.prepare();

        return this.dir.edit();
      },
    },
  }),
);
