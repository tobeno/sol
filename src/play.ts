import { sol } from './sol';
import { edit } from './integrations/editor';
import { wrapObject } from './data/transformer';
import { File } from './storage/file';
import { rerequire } from './utils/module';

const playWatchers: Record<string, () => void> = {};

function runPlay(playId: string, playFile: File) {
  let result = rerequire(playFile.path);

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
      const unwatch = playFile.watch((event) => {
        if (event === 'change') {
          let result = undefined;
          try {
            if (running) {
              return;
            }

            console.log(`Running play ${playId}...`);

            running = true;
            result = runPlay(playId, playFile);
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
  const playId = playFile.path;

  if (!playFile.exists) {
    throw new Error(`No play found for '${path}'`);
  }

  return runPlay(playId, playFile);
}
