// #region SETUP
/* eslint-disable */
// Globals from Sol
import { globals } from '/Users/tobi/Projects/sol/src/globals';
const {
  web,
  csv,
  html,
  json,
  xml,
  ast,
  yaml,
  sol,
  astTypes,
  jsonata,
  cheerio,
  cwd,
  shell,
  utils,
  log,
  vscode,
  play,
  replay,
  unwatchPlay,
  clipboard,
  file,
  dir,
  files,
  dirs,
  grep,
  glob,
  fetch,
} = globals;

// Needed to avoid errors
// @ts-ignore
const used = [
  web,
  csv,
  html,
  json,
  xml,
  ast,
  yaml,
  sol,
  astTypes,
  jsonata,
  cheerio,
  cwd,
  shell,
  utils,
  log,
  vscode,
  play,
  replay,
  unwatchPlay,
  clipboard,
  file,
  dir,
  files,
  dirs,
  grep,
  glob,
  fetch,
];

/** Stops watching this file (in play mode) */
const unwatch = () => {};

/** Set result to return something from the play file */
let result: any = undefined;

// --------------------------------------------------------
// #endregion SETUP

export const localGlobals = {
  test: () => {
    console.log('test');
  },
  xxx() {
    console.log('xxx');
  },
};

sol.registerLocalGlobals(localGlobals);
