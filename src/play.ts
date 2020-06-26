import { sol } from './sol';
import { edit } from './integrations/editor';
import { wrapObject } from './data/mapper';

const playWatchers: Record<string, () => void> = {};

function runPlay(playId: string, code: string) {
  code = code.replace(
    /\brequire\((['"])(\.{1,2}\/)/g,
    `require($1${sol.playDir.relativePathFrom(__dirname)}/$2`,
  );

  let result = eval(`const shared = global.shared; ${code}`);

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
    let timeout: NodeJS.Timeout | null = null;
    const unwatch = playFile.watch((event) => {
      if (event === 'change') {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        // Delay to avoid double execution
        timeout = setTimeout(() => {
          timeout = null;
          const result = runPlay(playId, playFile.text);

          if (typeof result !== 'undefined') {
            console.log(result);
            sol.server?.displayPrompt();
          }
        }, 50);
      } else if (event === 'rename') {
        if (!playFile.exists) {
          unwatchPlay(playId);
        }
      }
    });

    playWatchers[playId] = unwatch;

    console.log(`Watching ${playId}...`);
  }

  return playFile;
}

export function setupPlay(path: string) {
  const playFile = sol.playFile(path);

  playFile.create();

  if (!playFile.size) {
    playFile.text = `
/// <reference path="${sol.playContextFile.dir.relativePathFrom(
      playFile.dir,
    )}/${sol.playContextFile.basename}" />

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

  return runPlay(playId, playFile.text);
}
