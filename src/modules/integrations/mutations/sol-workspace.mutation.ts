import { definePropertiesMutation, mutateClass } from '@sol/utils/mutation';
import { edit } from '../editor';
import { Directory } from '../../storage/directory';
import { Workspace } from '../../sol/workspace';
import { StorageItem } from '../../storage/storage-item';
import { open } from '../open';

declare module '../../sol/workspace' {
  interface Workspace {
    edit(): Directory;

    open(app?: string): Directory;
  }
}

mutateClass(
  Workspace,
  definePropertiesMutation({
    edit: {
      value(): Directory {
        edit(this.dir.path);

        return this.dir;
      },
    },
    open: {
      value(app?: string): StorageItem {
        open(this.dir.uri, app);

        return this.dir;
      },
    },
  }),
);
