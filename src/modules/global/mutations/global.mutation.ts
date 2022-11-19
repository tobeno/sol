import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation';
import { withHelp } from '../../../utils/metadata';
import {
  codeToAst,
  csvToData,
  jsonToData,
  transform,
  yamlToData,
} from '../../transform/transformer';
import { awaitSync } from '../../../utils/async';
import { browse } from '../../integrations/browser';
import chalk from 'chalk';
import { getClipboard } from '../../clipboard/clipboard';
import { getCwd, getEnv } from '../../../utils/env';
import { Data } from '../../data/data';
import { Directory } from '../../storage/directory';
import { dirs, files, glob } from '../../storage/storage-item-collection';
import { edit } from '../../integrations/editor';
import { File } from '../../storage/file';
import { grep } from '../../storage/search';
import jsonata from 'jsonata';
import { log } from '../../../utils/log';
import { open, openApp } from '../../integrations/open';
import { listPlays, play, playFile, replay } from '../../play/play';
import type * as shell from '../../shell/sh';
import {
  getSolExtensions,
  solExtension,
  solUserExtension,
  solWorkspaceExtension,
} from '../../sol/sol-extension';
import {
  getCurrentSolWorkspace,
  getSolUserWorkspace,
} from '../../sol/sol-workspace';
import { Text } from '../../data/text';
import { Url } from '../../web/url';
import type * as classes from '../globals/classes.global';
import type * as utils from '../globals/utils.global';
import { sortObjectKeys } from '../../../utils/object';
import { web } from '../../web/web';
import { tmp } from '../../storage/tmp';
import { FromPropertyDescriptorMap } from '../../../interfaces/object';
import { Markdown } from '../../data/markdown';
import { getSolPackage } from '../../sol/sol-package';
import { fileCached, runtimeCached } from '../../cache/cache';
import { Html } from '../../data/html';
import { Xml } from '../../data/xml';

export const globals = {
  args: withHelp(
    {
      get() {
        return Data.create(process.argv.slice(2));
      },
    },
    'Returns the arguments passed to Sol',
  ),
  ast: withHelp(
    {
      value: codeToAst,
    },
    'Converts code to its AST to Data',
  ),
  astTypes: withHelp(
    {
      get() {
        return require('@babel/types');
      },
    },
    'See https://babeljs.io/docs/en/babel-types',
  ),
  awaitSync: withHelp(
    {
      value: awaitSync,
    },
    'Waits for the given promise before continuing',
  ),
  browse: withHelp(
    {
      value: browse,
    },
    'Opens the given URL in the browser',
  ),
  chalk: withHelp(
    {
      value: chalk,
    },
    'See https://github.com/chalk/chalk#readme',
  ),
  clipboard: withHelp(
    {
      get() {
        return getClipboard();
      },
    },
    'Exposes the system clipboard',
  ),
  csv: withHelp(
    {
      value: csvToData,
    },
    'Converts CSV to Data',
  ),
  cwd: withHelp(
    {
      get() {
        return Directory.create(getCwd());
      },
    },
    'Returns the current working directory',
  ),
  data: withHelp(
    {
      value: Data.create,
    },
    'Wraps the given object as Data',
  ),
  day: withHelp(
    {
      get() {
        return require('../../date/day').day;
      },
    },
    'See https://day.js.org/docs/en/installation/installation',
  ),
  dir: withHelp(
    {
      value: Directory.create,
    },
    'Wrapper for directories',
  ),
  dirs: withHelp(
    {
      value: dirs,
    },
    'Glob search for directories',
  ),
  edit: withHelp(
    {
      value: edit,
    },
    'Opens a file for editing (defaults to code as editor)',
  ),
  env: withHelp(
    {
      get() {
        return getEnv();
      },
    },
    'Returns the environment variables',
  ),
  fetch: withHelp(
    {
      value: web.fetch,
    },
    'HTTP fetch compatible to node-fetch',
  ),
  file: withHelp(
    {
      value: File.create,
    },
    'Wrapper for files',
  ),
  files: withHelp(
    {
      value: files,
    },
    'Glob search for files',
  ),
  fileCached: withHelp(
    {
      value: fileCached,
    },
    'Cache the return value of the given function in a file',
  ),
  glob: withHelp(
    {
      value: glob,
    },
    'Glob search for files or directories',
  ),
  grep: withHelp(
    {
      value: grep,
    },
    'Finds files using the given RegExp pattern',
  ),
  html: withHelp(
    {
      value: Html.create,
    },
    'Wraps the given string as Html',
  ),
  json: withHelp(
    {
      value: jsonToData,
    },
    'Converts JSON to Data',
  ),
  jsonata: withHelp(
    {
      value: jsonata,
    },
    'See https://jsonata.org/',
  ),
  jwt: withHelp(
    {
      get() {
        return require('../../security/jwt').jwt;
      },
    },
    'See https://github.com/auth0/node-jsonwebtoken#readme',
  ),
  log: withHelp(
    {
      value: log,
    },
    'Logs to the console',
  ),
  markdown: withHelp(
    {
      value: Markdown.create,
    },
    'Wraps the given string as Markdown',
  ),
  open: withHelp(
    {
      value: open,
    },
    'Opens the given file or URL',
  ),
  openApp: withHelp(
    {
      value: openApp,
    },
    'Opens the given app',
  ),
  play: withHelp(
    {
      value: play,
    },
    'Opens a given play file for interactive editing',
  ),
  playFile: withHelp(
    {
      value: playFile,
    },
    'Returns a PlayFile instance for the given path or file',
  ),
  plays: withHelp(
    {
      get() {
        return listPlays();
      },
    },
    'List available play files',
  ),
  replay: withHelp(
    {
      value: replay,
    },
    'Replays the given play file',
  ),
  runtimeCached: withHelp(
    {
      value: runtimeCached,
    },
    'Cache the return value of the given function in a runtime variable',
  ),
  shared: withHelp(
    {
      value: {},
    },
    'Variables shared between play scripts and the shell',
  ),
  sh: withHelp(
    {
      get(): typeof shell {
        return require('../../shell/sh');
      },
    },
    'Shell utilities',
  ),
  solExtension: withHelp(
    {
      value: solExtension,
    },
    'Returns the extension for the given name or path',
  ),
  solExtensions: withHelp(
    {
      get() {
        return getSolExtensions();
      },
    },
    'Returns known sol extensions',
  ),
  solPackage: withHelp(
    {
      get() {
        return getSolPackage();
      },
    },
    'Returns the Sol package',
  ),
  solUserExtension: withHelp(
    {
      value: solUserExtension,
    },
    'Returns the user extension for the given name',
  ),
  solUserWorkspace: withHelp(
    {
      get() {
        return getSolUserWorkspace();
      },
    },
    'User Sol workspace',
  ),
  solWorkspace: withHelp(
    {
      get() {
        return getCurrentSolWorkspace();
      },
    },
    'Current Sol workspace',
  ),
  solWorkspaceExtension: withHelp(
    {
      value: solWorkspaceExtension,
    },
    'Returns the workspace extension for the given name',
  ),
  text: withHelp(
    {
      value: Text.create,
    },
    'Wraps a string as Text',
  ),
  tmp: withHelp(
    {
      value: tmp,
    },
    'Temporary file',
  ),
  transform: withHelp(
    {
      value: transform,
    },
    'Transforms data between data types using transformations',
  ),
  url: withHelp(
    {
      value: Url.create,
    },
    'Wraps a text URL as a Url',
  ),
  classes: withHelp(
    {
      get(): typeof classes {
        return sortObjectKeys(require('../globals/classes.global'));
      },
    },
    'Classes',
  ),
  utils: withHelp(
    {
      get(): typeof utils {
        return require('../globals/utils.global');
      },
    },
    'Basic utility functions',
  ),
  web: withHelp(
    {
      value: web,
    },
    'Utilities for internet access',
  ),
  withHelp: {
    value: withHelp,
  },
  xml: withHelp(
    {
      value: Xml.create,
    },
    'Wraps the given string as Xml',
  ),
  yaml: withHelp(
    {
      value: yamlToData,
    },
    'Converts YAML to Data',
  ),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const args: Globals['args'];
  const ast: Globals['ast'];
  const astTypes: Globals['astTypes'];
  const awaitSync: Globals['awaitSync'];
  const browse: Globals['browse'];
  const chalk: Globals['chalk'];
  const clipboard: Globals['clipboard'];
  const csv: Globals['csv'];
  const cwd: Globals['cwd'];
  const data: Globals['data'];
  const day: Globals['day'];
  const dir: Globals['dir'];
  const dirs: Globals['dirs'];
  const edit: Globals['edit'];
  const env: Globals['env'];
  const file: Globals['file'];
  const files: Globals['files'];
  const fileCached: Globals['fileCached'];
  const glob: Globals['glob'];
  const grep: Globals['grep'];
  const json: Globals['json'];
  const jsonata: Globals['jsonata'];
  const log: Globals['log'];
  const open: Globals['open'];
  const openApp: Globals['openApp'];
  const play: Globals['play'];
  const playFile: Globals['playFile'];
  const plays: Globals['plays'];
  const replay: Globals['replay'];
  const runtimeCached: Globals['runtimeCached'];
  const shared: Globals['shared'];
  const sh: Globals['sh'];
  const solExtension: Globals['solExtension'];
  const solExtensions: Globals['solExtensions'];
  const solPackage: Globals['solPackage'];
  const solUserExtension: Globals['solUserExtension'];
  const solUserWorkspace: Globals['solUserWorkspace'];
  const solWorkspace: Globals['solWorkspace'];
  const solWorkspaceExtension: Globals['solWorkspaceExtension'];
  const text: Globals['text'];
  const tmp: Globals['tmp'];
  const transform: Globals['transform'];
  const url: Globals['url'];
  const classes: Globals['classes'];
  const utils: Globals['utils'];
  const web: Globals['web'];
  const withHelp: Globals['withHelp'];
  const yaml: Globals['yaml'];

  // DOM globals
  type BufferSource = any;
  type FormData = any;
}

mutateGlobals(definePropertiesMutation(globals));
