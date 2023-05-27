import { SolExtension } from '../../../sol/sol-extension';
import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { open } from '../../../utils/open.utils';
import { Directory } from '../../../wrappers/directory.wrapper';
import { edit } from '../utils/editor.utils';

declare module '../../../sol/sol-extension' {
  interface SolExtension {
    /**
     * Opens the extension in the default editor.
     */
    edit(): Directory;

    /**
     * Opens the extension in the default or given app.
     */
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
      value(app?: string): Directory {
        this.prepare();

        open(this.dir.uri, app);

        return this.dir;
      },
    },
  }),
);
