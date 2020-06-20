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
    .replace(/[\s\S]+#endregion SETUP/, '')
    .replace(/\nexport (const|let|function|class)/, '\n$1');

  let result = eval(
    `const unwatch = () => { global.unwatchPlay('${playId}'); };\nlet result = undefined;\n${code}\nresult`,
  );

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

export function setupPlay(path: string, noLocalGlobals = false) {
  const playFile = sol.playFile(path);

  playFile.create();

  const localGlobalsKeys = Object.keys(sol.localGlobals);
  const globalsKeys = Object.keys(sol.globals);
  let localGlobalsImport;

  if (!noLocalGlobals) {
    const { localGlobalsFile } = sol;
    localGlobalsImport = `
// Globals from .sol/globals.ts
import { localGlobals } from '${localGlobalsFile.path.slice(
      0,
      -1 * (localGlobalsFile.ext.length + 1),
    )}';
const { ${localGlobalsKeys.join(', ')} } = localGlobals;`.trim();
  } else {
    localGlobalsImport = '';
  }

  playFile.text =
    `
// #region SETUP
/* eslint-disable */
// Globals from Sol
import { globals } from '${sol.packageSrcDir.path}/globals';
const { ${globalsKeys.join(', ')} } = globals;
${localGlobalsImport}

// Needed to avoid errors
// @ts-ignore
const used = [ ${[
      ...globalsKeys,
      ...(!noLocalGlobals ? localGlobalsKeys : []),
    ].join(', ')} ];

/** Stops watching this file (in play mode) */
const unwatch = () => {};

/** Set result to return something from the play file */
let result: any = undefined;

// --------------------------------------------------------
// #endregion SETUP

`.trimStart() +
    playFile.text.replace(/[\s\S]+#endregion SETUP/, '').trimStart();
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
