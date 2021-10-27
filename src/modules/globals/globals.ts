import jsonata from 'jsonata';
import { JSDOM } from 'jsdom';
import chalk from 'chalk';
import * as R from 'remeda';
import changeCase from 'change-case';
import { grep } from '../storage/search';
import { file, File } from '../storage/file';
import { dir, Directory } from '../storage/directory';
import {
  DirectoryCollection,
  dirs,
  FileCollection,
  files,
  glob,
  ItemCollection,
} from '../storage/item-collection';
import { web } from '../web';
import { getClipboard } from '../os/clipboard';
import * as asyncUtils from '../utils/async';
import { awaitSync } from '../utils/async';
import * as arrayUtils from '../utils/array';
import * as objectUtils from '../utils/object';
import * as textUtils from '../utils/text';
import * as metadataUtils from '../utils/metadata';
import { withHelp } from '../utils/metadata';
import { getCwd } from '../utils/env';
import { log } from '../utils/log';
import { getSol } from '../sol/sol';
import { edit } from '../integrations/editor';
import { listPlays, play, replay, unwatchPlay } from '../play/play';
import * as shell from '../utils/shelljs';
import {
  csvToData,
  jsonToData,
  transform,
  wrapHtml,
  wrapObject,
  wrapString,
  wrapUrl,
  wrapXml,
  yamlToData,
} from '../data/transformer';
import { astTypes } from '../data/ast';
import { DataType } from '../data/data-type';
import { DataFormat } from '../data/data-format';
import { DataTransformation } from '../data/data-transformation';
import { FromPropertyDescriptorMap } from '../../interfaces/object';
import {
  extension,
  getExtensions,
  getLoadedExtensions,
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
      value: astTypes,
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
  changeCase: withHelp(
    {
      value: changeCase,
    },
    'See https://github.com/blakeembrey/change-case',
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
      value: wrapObject,
    },
    'Wraps the given object as Data',
  ),
  dir: withHelp(
    {
      value: dir,
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
      value: file,
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
  html: withHelp(
    {
      value: wrapHtml,
    },
    'Converts HTML to Data',
  ),
  JSDOM: withHelp(
    {
      value: JSDOM,
    },
    'See https://github.com/jsdom/jsdom',
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
  pipe: withHelp(
    {
      value: R.pipe,
    },
    'Pipe helper from Remeda',
  ),
  play: withHelp(
    {
      value: play,
    },
    'Opens a given play file for interactive editing',
  ),
  plays: withHelp(
    {
      get() {
        return listPlays();
      },
    },
    'List available play files',
  ),
  R: withHelp({ value: R }, 'Remeda'),
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
      value: wrapString,
    },
    'Wraps a string as Text',
  ),
  transform: withHelp(
    {
      value: transform,
    },
    'Transforms data between data types using transformations',
  ),
  unwatchPlay: {
    value: unwatchPlay,
  },
  url: {
    value: wrapUrl,
  },
  userExtension: withHelp(
    {
      get() {
        return getUserWorkspace();
      },
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
  utils: withHelp(
    {
      value: {
        ...asyncUtils,
        ...metadataUtils,
        ...arrayUtils,
        ...objectUtils,
        ...textUtils,
        DataType,
        DataFormat,
        DataTransformation,
        Directory,
        DirectoryCollection,
        File,
        FileCollection,
        ItemCollection,
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
  xml: withHelp(
    {
      value: wrapXml,
    },
    'Converts XML to Data',
  ),
  yaml: withHelp(
    {
      value: yamlToData,
    },
    'Converts YAML to Data',
  ),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;
