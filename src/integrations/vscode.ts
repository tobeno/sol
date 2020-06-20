import { File, file } from '../storage/file';
import { tmp } from '../storage/tmp';
import { sol } from '../sol';
import { json } from '../data/json';

export function vscode(pathOrValue?: any): File {
  let f: File;

  if (!pathOrValue) {
    f = tmp('ts');
  } else if (typeof pathOrValue === 'object') {
    if (
      pathOrValue.constructor !== Object &&
      typeof pathOrValue.data !== 'undefined'
    ) {
      pathOrValue = pathOrValue.data;
    }

    f = tmp('json');
    f.data = pathOrValue;
  } else if (
    typeof pathOrValue === 'string' &&
    /(^\s|\n|\s$)/.test(pathOrValue)
  ) {
    f = tmp('txt');
    f.text = pathOrValue;
  } else {
    f = file(pathOrValue);
  }

  f.create();

  f.vscode();

  return f;
}

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

  vscode(playFile.path);

  if (!playWatchers[playId]) {
    let timeout: NodeJS.Timeout | null = null;
    const unwatch = playFile.watch((event) => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      // Delay to avoid double execution
      timeout = setTimeout(() => {
        timeout = null;
        if (event === 'change') {
          const result = runPlay(playId, playFile.text);

          if (typeof result !== 'undefined') {
            console.log(result);
            sol.server?.displayPrompt();
          }
        } else if (event === 'rename') {
          if (!playFile.exists) {
            unwatchPlay(playId);
          }
        }
      }, 10);
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
import '${sol.packageDistDir.path}/globals';
import '${localGlobalsFile.pathWithoutExt}';
`.trimStart();
}

export function setupPlay(path: string, noLocalGlobals = false) {
  const playFile = sol.playFile(path);

  playFile.create();

  playFile.text =
    `
/* eslint-disable */
import '${sol.playContextFile.pathWithoutExt}';
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
