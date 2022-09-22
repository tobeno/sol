import jsonata from 'jsonata';
import chalk from 'chalk';
import { grep } from '../storage/search';

import { File } from '../storage/file';
import { Directory } from '../storage/directory';
import { dirs, files, glob } from '../storage/storage-item-collection';
import { web } from '../web';
import { getClipboard } from '../os/clipboard';
import * as asyncUtils from '../../utils/async';
import { awaitSync } from '../../utils/async';
import * as arrayUtils from '../../utils/array';
import * as objectUtils from '../../utils/object';
import * as textUtils from '../../utils/text';
import * as metadataUtils from '../../utils/metadata';
import { withHelp } from '../../utils/metadata';
import { getCwd, getEnv } from '../../utils/env';
import { log } from '../../utils/log';
import { getSol } from '../sol/sol';
import { edit } from '../integrations/editor';
import { listPlays, play, playFile, replay } from '../play/play';
import * as shell from '../shell/sh';
import {
  csvToData,
  jsonToData,
  transform,
  yamlToData,
} from '../transform/transformer';
import * as classes from './classes';
import { Data, Text, Url } from './classes';
import { FromPropertyDescriptorMap } from '../../interfaces/object';
import {
  extension,
  getExtensions,
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
  env: withHelp(
    {
      get() {
        return getEnv();
      },
    },
    'Returns the environment variables',
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
      value: extension,
    },
    'Returns the extension for the given name or path',
  ),
  solExtensions: withHelp(
    {
      get() {
        return getExtensions();
      },
    },
    'Returns known sol extensions',
  ),
  solUserExtension: withHelp(
    {
      value: userExtension,
    },
    'Returns the user extension for the given name',
  ),
  solUserWorkspace: withHelp(
    {
      get() {
        return getUserWorkspace();
      },
    },
    'User Sol workspace',
  ),
  solWorkspace: withHelp(
    {
      get() {
        return getCurrentWorkspace();
      },
    },
    'Current Sol workspace',
  ),
  solWorkspaceExtension: withHelp(
    {
      value: workspaceExtension,
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
