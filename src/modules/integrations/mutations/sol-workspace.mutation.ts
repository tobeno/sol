import { SolWorkspace } from '../../../sol/sol-workspace';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { open } from '../../../utils/open';
import { Directory } from '../../../wrappers/directory';
import { edit } from '../utils/editor';

declare module '../../../sol/sol-workspace' {
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
