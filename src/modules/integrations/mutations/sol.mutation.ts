import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Sol } from '../../sol/sol';
import { Directory } from '../../storage/directory';
import { StorageItem } from '../../storage/storage-item';
import { open } from '../open';

declare module '../../sol/sol' {
  interface Sol {
    edit(): Directory;

    open(app?: string): Directory;
  }
}

mutateClass(
  Sol,
  definePropertiesMutation({
    edit: {
      value(): Directory {
        edit(this.packageDir.path);

        return this.packageDir;
      },
    },
    open: {
      value(app?: string): StorageItem {
        open(this.packageDir.uri, app);

        return this.packageDir;
      },
    },
  }),
);
