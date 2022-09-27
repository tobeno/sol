import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation';
import * as metadataUtils from '../../../utils/metadata';
import { withHelp } from '../../../utils/metadata';
import {
  codeToAst,
  csvToData,
  jsonToData,
  transform,
  yamlToData,
} from '../../transform/transformer';
import * as asyncUtils from '../../../utils/async';
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
import * as shell from '../../shell/sh';
import { getSol } from '../../sol/sol';
import {
  solExtension,
  getSolExtensions,
  solUserExtension,
  solWorkspaceExtension,
} from '../../sol/sol-extension';
import {
  getCurrentSolWorkspace,
  getSolUserWorkspace,
} from '../../sol/sol-workspace';
import { Text } from '../../data/text';
import { Url } from '../../data/url';
import * as classes from '../classes';
import * as arrayUtils from '../../../utils/array';
import * as objectUtils from '../../../utils/object';
import * as textUtils from '../../../utils/text';
import { web } from '../../web/web';
import { FromPropertyDescriptorMap } from '../../../interfaces/object';
import { Markdown } from '../../data/markdown';

export const globals = {
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
  shared: withHelp(
    {
      value: {},
    },
    'Variables shared between play scripts and the shell',
  ),
  sh: withHelp(
    {
      value: shell,
    },
    'Shell utilities',
  ),
  sol: withHelp(
    {
      get() {
        return getSol();
      },
    },
    'Current Sol instance',
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
      value: classes,
    },
    'Classes',
  ),
  utils: withHelp(
    {
      value: {
        ...asyncUtils,
        ...metadataUtils,
        ...arrayUtils,
        ...objectUtils,
        ...textUtils,
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
  yaml: withHelp(
    {
      value: yamlToData,
    },
    'Converts YAML to Data',
  ),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const ast: Globals['ast'];
  const astTypes: Globals['astTypes'];
  const awaitSync: Globals['awaitSync'];
  const browse: Globals['browse'];
  const chalk: Globals['chalk'];
  const clipboard: Globals['clipboard'];
  const csv: Globals['csv'];
  const cwd: Globals['cwd'];
  const data: Globals['data'];
  const dir: Globals['dir'];
  const dirs: Globals['dirs'];
  const edit: Globals['edit'];
  const env: Globals['env'];
  const file: Globals['file'];
  const files: Globals['files'];
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
  const shared: Globals['shared'];
  const sh: Globals['sh'];
  const sol: Globals['sol'];
  const solExtension: Globals['solExtension'];
  const solExtensions: Globals['solExtensions'];
  const solUserExtension: Globals['solUserExtension'];
  const solUserWorkspace: Globals['solUserWorkspace'];
  const solWorkspace: Globals['solWorkspace'];
  const solWorkspaceExtension: Globals['solWorkspaceExtension'];
  const text: Globals['text'];
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
