import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Directory } from '../../storage/directory';
import { open } from '../../../utils/open';
import { SolPackage } from '../../sol/sol-package';

declare module '../../sol/sol-package' {
  interface SolPackage {
    /**
     * Opens the Sol package in the default editor.
     */
    edit(): Directory;

    /**
     * Opens the Sol package in the default or given app.
     */
    open(app?: string): Directory;
  }
}

mutateClass(
  SolPackage,
  definePropertiesMutation({
    edit: {
      value(): Directory {
        edit(this.dir.path);

        return this.dir;
      },
    },
    open: {
      value(app?: string): Directory {
        open(this.dir.uri, app);

        return this.dir;
      },
    },
  }),
);
