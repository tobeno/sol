import { definePropertiesMutation, mutateClass } from '../utils/mutation';
import { File } from '../storage/file';
import { play, replay, setupPlay, unwatchPlay } from './play';

declare module '../storage/file' {
  interface File<ContentType = any> {
    play(): File;

    setupPlay(): void;

    replay(): any;

    unwatchPlay(): void;
  }
}

mutateClass(
  File,
  definePropertiesMutation({
    play: {
      value(): File {
        return play(this.path);
      },
    },

    setupPlay: {
      value(): void {
        setupPlay(this.path);
      },
    },

    replay: {
      value(): any {
        return replay(this.path);
      },
    },

    unwatchPlay: {
      value(): void {
        unwatchPlay(this.path);
      },
    },
  }),
);
