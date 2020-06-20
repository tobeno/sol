import { sol } from './sol';
import { json } from './data/json';

const playWatchers: Record<string, () => void> = {};

function runPlay(playId: string, code: string) {
  code = code
    .replace(/[\s\S]+\/\/ --- END SETUP ---/, '')
    .replace(/type LocalGlobals[\s\S]+/, '')
    .replace(/\nexport (const|let|function|class)/, '\n$1');

  let result = eval(code);

  if (result && typeof result === 'object') {
    if (result.constructor === Object) {
      result = json(result);
    } else if (result.constructor === Array) {
      result = json(result);
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

export function setupPlayContext(path: string) {
  const playContextFile = file(path);
  const localGlobalsFile = file(sol.localGlobalsFilePath);
  playContextFile.text = `
import '${sol.packageDistDir.relativePathFrom(playContextFile.dir)}/globals';
import '${localGlobalsFile.dir.relativePathFrom(playContextFile.dir)}/${
    localGlobalsFile.name
  }';
`.trimStart();
}

export function setupPlay(path: string, noLocalGlobals = false) {
  const playFile = sol.playFile(path);

  playFile.create();

  playFile.text =
    `
/* eslint-disable */
import '../${sol.playContextFile.name}';
// --- END SETUP ---

`.trimStart() +
    playFile.text.replace(/[\s\S]+\/\/ --- END SETUP ---/, '').trimStart();
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
