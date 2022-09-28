import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { File } from '../../storage/file';
import { play, PlayFile, replay, unplay } from '../play';

declare module '../../storage/file' {
  interface File {
    play(): PlayFile;

    replay<ReturnType = any>(): ReturnType;

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
