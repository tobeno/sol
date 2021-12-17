import { edit } from '../integrations/editor';
import { file, File } from '../storage/file';
import { rerequire } from '../utils/module';
import { Directory } from '../storage/directory';
import { getReplServer } from '../sol/repl';
import { log } from '../utils/log';
import { getCurrentWorkspace, getCurrentWorkspaceDir } from '../sol/workspace';
import { wrapObject } from '../data/data';

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

export function getPlayDir(): Directory {
  return getCurrentWorkspaceDir().dir('play');
}

export function getPlayFile(path?: string) {
  path = path || `play-${new Date().toISOString().replace(/[^0-9]/g, '')}`;

  if (!path.endsWith('.ts')) {
    path += '.ts';
  }

  let playFile;
  if (!path.includes('/')) {
    playFile = getPlayDir().file(path);
  } else {
    playFile = file(path);
  }

  return playFile;
}

export function play(path?: string) {
  const playFile = getPlayFile(path);
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

            log(`Running play ${playId}...`);

            running = true;
            result = runPlay(playFile);
          } finally {
            running = false;
          }

          if (typeof result !== 'undefined') {
            log(result);
            getReplServer().displayPrompt();
          }
        } else if (event === 'rename') {
          if (!playFile.exists) {
            unwatchPlay(playId);
          }
        }
      });

      playWatchers[playId] = unwatch;

      log(`Watching ${playId}...`);
    }, 1000);
  }

  return playFile;
}

export function listPlays() {
  return [...getPlayDir().files()].reduce(
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
  const playFile = getPlayFile(path);
  const workspace = getCurrentWorkspace();

  playFile.create();

  if (!playFile.size) {
    playFile.text = `
/* eslint-disable */
// @ts-nocheck

import './${workspace.contextFile.dir.relativePathFrom(playFile.dir)}/${
      workspace.contextFile.basenameWithoutExt
    }';
    
// ToDo: Add your logic

export default null;
`.trimStart();
  }
}

export function unwatchPlay(path: string) {
  const playFile = getPlayFile(path);
  const playId = playFile.path;

  if (playWatchers[playId]) {
    playWatchers[playId]();
    delete playWatchers[playId];

    log(`Stopped watching ${playId}`);
  }
}

export function unwatchPlays() {
  Object.keys(playWatchers).forEach((playId) => {
    unwatchPlay(playId);
  });
}

export function replay(path: string) {
  const playFile = getPlayFile(path);

  if (!playFile.exists) {
    throw new Error(`No play found for '${path}'`);
  }

  return runPlay(playFile);
}
