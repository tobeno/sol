import { sol } from '../sol/sol';
import { edit } from '../integrations/editor';
import { wrapObject } from '../data/transformer';
import { File } from '../storage/file';
import { rerequire } from '../utils/module';

const playWatchers: Record<string, () => void> = {};

export interface PlayFile {
  play(): void;
  replay(): void;
}

function runPlay(playFile: File) {
  let result = rerequire(playFile.path);

  if (typeof result.default !== 'undefined') {
    result = result.default;
  }

  if (result && typeof result === 'object') {
    if (result.constructor === Object) {
      result = wrapObject(result);
    } else if (result.constructor === Array) {
      result = wrapObject(result);
    }
  }

  return result;
}

export function play(path?: string) {
  const playFile = sol.playFile(path);
  const playId = playFile.path;

  setupPlay(playFile.path);

  edit(playFile.path);

  if (!playWatchers[playId]) {
    let running = false;

    setTimeout(() => {
      let prevText: string | null = null;

      const unwatch = playFile.watch((event) => {
        if (event === 'change') {
          let result = undefined;
          try {
            const text = playFile.text.value;
            if (text === prevText) {
              return;
            }

            prevText = text;

            if (running) {
              return;
            }

            console.log(`Running play ${playId}...`);

            running = true;
            result = runPlay(playFile);
          } finally {
            running = false;
          }

          if (typeof result !== 'undefined') {
            console.log(result);
            sol.server?.displayPrompt();
          }
        } else if (event === 'rename') {
          if (!playFile.exists) {
            unwatchPlay(playId);
          }
        }
      });

      playWatchers[playId] = unwatch;

      console.log(`Watching ${playId}...`);
    }, 1000);
  }

  return playFile;
}

export function listPlays() {
  return [...sol.playDir.files()].reduce(
    (result: Record<string, PlayFile>, file) => {
      result[file.basenameWithoutExt] = {
        play: () => play(file.path),
        replay: () => replay(file.path),
      };

      return result;
    },
    {},
  );
}

export function setupPlay(path: string) {
  const playFile = sol.playFile(path);

  playFile.create();

  if (!playFile.size) {
    playFile.text = `
// @ts-nocheck
/* eslint-disable */

import './${sol.playContextFile.dir.relativePathFrom(playFile.dir)}/${
      sol.playContextFile.basenameWithoutExt
    }';

export default null;
`.trimStart();
  }
}

export function unwatchPlay(path: string) {
  const playFile = sol.playFile(path);
  const playId = playFile.path;

  if (playWatchers[playId]) {
    playWatchers[playId]();
    delete playWatchers[playId];

    console.log(`Stopped watching ${playId}`);
  }
}

export function replay(path: string) {
  const playFile = sol.playFile(path);

  if (!playFile.exists) {
    throw new Error(`No play found for '${path}'`);
  }

  return runPlay(playFile);
}
