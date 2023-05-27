import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { File } from '../../../wrappers/file.wrapper';
import { play, PlayFile, replay, unplay } from '../utils/play.utils';

declare module '../../../wrappers/file.wrapper' {
  interface File {
    /**
     * Opens the file in the default editor and starts watching for changes.
     */
    play(): PlayFile;

    /**
     * Runs the file as playground file.
     */
    replay<ReturnType = any>(): ReturnType;

    /**
     * Stops watching for changes.
     */
    unplay(): void;
  }
}

mutateClass(
  File,
  definePropertiesMutation({
    play: {
      value(): PlayFile {
        return play(this);
      },
    },

    replay: {
      value(): any {
        return replay(this);
      },
    },

    unplay: {
      value(): void {
        unplay(this);
      },
    },
  }),
);
