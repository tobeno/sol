import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Directory } from '../../storage/directory';
import { SolExtension } from '../../sol/sol-extension';
import { StorageItem } from '../../storage/storage-item';
import { open } from '../open';

declare module '../../sol/sol-extension' {
  interface Extension {
    edit(): Directory;

    open(app?: string): Directory;
  }
}

mutateClass(
  SolExtension,
  definePropertiesMutation({
    edit: {
      value(): Directory {
        this.prepare();

        edit(this.dir.path);

        return this.dir;
      },
    },
    open: {
      value(app?: string): StorageItem {
        this.prepare();

        open(this.dir.uri, app);

        return this.dir;
      },
    },
  }),
);