import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { edit } from './editor';
import { Directory } from '../storage/directory';
import { Extension } from '../sol/extension';
import { Item } from '../storage/item';
import { open } from './open';

declare module '../sol/extension' {
  interface Extension {
    edit(): Directory;

    open(app?: string): Directory;
  }
}

mutateClass(
  Extension,
  definePropertiesMutation({
    edit: {
      value(): Directory {
        edit(this.dir.path);

        return this.dir;
      },
    },
    open: {
      value(app?: string): Item {
        open(this.dir.uri, app);

        return this.dir;
      },
    },
  }),
);