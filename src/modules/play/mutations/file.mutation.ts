import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../../../wrappers/file';
import { play, PlayFile, replay, unplay } from '../utils/play';

declare module '../../../wrappers/file' {
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
