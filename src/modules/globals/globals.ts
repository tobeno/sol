import * as jsonata from 'jsonata';
import { JSDOM } from 'jsdom';
import * as chalk from 'chalk';
import * as R from 'remeda';
import * as changeCase from 'change-case';
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
import { clipboard } from '../os/clipboard';
import * as asyncUtils from '../utils/async';
import { awaitSync } from '../utils/async';
import * as arrayUtils from '../utils/array';
import * as objectUtils from '../utils/object';
import * as textUtils from '../utils/text';
import * as metadataUtils from '../utils/metadata';
import { withHelp } from '../utils/metadata';
import { getCwd } from '../utils/env';
import { log } from '../utils/log';
import { sol } from '../sol/sol';
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
  loadedExtensions,
  userExtension,
  workspaceExtension,
} from '../sol/extension';
import { userWorkspace, workspace } from '../sol/workspace';

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
      value: clipboard,
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
  log: withHelp(
    {
      value: log,
    },
    'Logs to the console',
  ),
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
  replay: {
    value: replay,
  },
  plays: withHelp(
    {
      get() {
        return listPlays();
      },
    },
    'List available play files',
  ),
  extension: withHelp(
    {
      value: extension,
    },
    'Returns the extension for the given name or path',
  ),
  workspaceExtension: withHelp(
    {
      value: workspaceExtension,
    },
    'Returns the workspace extension for the given name',
  ),
  userExtension: withHelp(
    {
      value: userExtension,
    },
    'Returns the user extension for the given name',
  ),
  loadedExtensions: {
    value: loadedExtensions,
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
      value: sol,
    },
    'Current Sol instance',
  ),
  workspace: withHelp(
    {
      value: workspace,
    },
    'Current Sol workspace',
  ),
  userWorkspace: withHelp(
    {
      value: userWorkspace,
    },
    'User Sol workspace',
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
  withHelp: {
    value: withHelp,
  },
  web: withHelp(
    {
      value: web,
    },
    'Utilities for internet access',
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
  R: withHelp({ value: R }, 'Remeda'),
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;
