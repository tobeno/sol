import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Directory } from '../../storage/directory';
import { SolWorkspace } from '../../sol/sol-workspace';
import { open } from '../../../utils/open';

declare module '../../sol/sol-workspace' {
  interface SolWorkspace {
    /**
     * Opens the Sol workspace in the default editor.
     */
    edit(): Directory;

    /**
     * Opens the Sol workspace in the default or given app.
     */
    open(app?: string): Directory;
  }
}

mutateClass(
  SolWorkspace,
  definePropertiesMutation({
    edit: {
      value(): Directory {
        this.prepare();

        edit(this.dir.path);

        return this.dir;
      },
    },
    open: {
      value(app?: string): Directory {
        this.prepare();

        open(this.dir.uri, app);

        return this.dir;
      },
    },
  }),
);
