import jsonata from 'jsonata';
import chalk from 'chalk';
import { grep } from '../storage/search';

import { File } from '../storage/file';
import { Directory } from '../storage/directory';
import { dirs, files, glob } from '../storage/storage-item-collection';
import { web } from '../web';
import { getClipboard } from '../os/clipboard';
import * as asyncUtils from '@sol/utils/async';
import { awaitSync } from '@sol/utils/async';
import * as arrayUtils from '@sol/utils/array';
import * as objectUtils from '@sol/utils/object';
import * as textUtils from '@sol/utils/text';
import * as metadataUtils from '@sol/utils/metadata';
import { withHelp } from '@sol/utils/metadata';
import { getCwd } from '@sol/utils/env';
import { log } from '@sol/utils/log';
import { getSol } from '../sol/sol';
import { edit } from '../integrations/editor';
import { listPlays, play, playFile, replay } from '../play/play';
import * as shell from '@sol/utils/shelljs';
import {
  csvToData,
  jsonToData,
  transform,
  yamlToData,
} from '../transform/transformer';
import * as classes from './classes';
import { Data, Text, Url } from './classes';
import { FromPropertyDescriptorMap } from '@sol/interfaces/object';
import {
  extension,
  getExtensions,
  getLoadedExtensions,
  userExtension,
  workspaceExtension,
} from '../sol/extension';
import { getCurrentWorkspace, getUserWorkspace } from '../sol/workspace';
import { browse } from '../integrations/browser';
import { open, openApp } from '../integrations/open';

export const globals = {
  ast: withHelp(
    {
      value: csvToData,
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
        return getCwd();
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
  extension: withHelp(
    {
      value: extension,
    },
    'Returns the extension for the given name or path',
  ),
  extensions: {
    get() {
      return getExtensions();
    },
  },
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
  loadedExtensions: {
    get() {
      return getLoadedExtensions();
    },
  },
  log: withHelp(
    {
      value: log,
    },
    'Logs to the console',
  ),
  open: {
    value: open,
  },
  openApp: {
    value: openApp,
  },
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
  replay: {
    value: replay,
  },
  shared: withHelp(
    {
      value: {},
    },
    'Variables shared between play scripts and the shell',
  ),
  shell: withHelp(
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
  url: {
    value: Url.create,
  },
  userExtension: withHelp(
    {
      value: userExtension,
    },
    'Returns the user extension for the given name',
  ),
  userWorkspace: withHelp(
    {
      get() {
        return getUserWorkspace();
      },
    },
    'User Sol workspace',
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
  workspace: withHelp(
    {
      get() {
        return getCurrentWorkspace();
      },
    },
    'Current Sol workspace',
  ),
  workspaceExtension: withHelp(
    {
      value: workspaceExtension,
    },
    'Returns the workspace extension for the given name',
  ),
  yaml: withHelp(
    {
      value: yamlToData,
    },
    'Converts YAML to Data',
  ),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;
