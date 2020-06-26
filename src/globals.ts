import * as jsonata from 'jsonata';
import { JSDOM } from 'jsdom';
import * as chalk from 'chalk';
import { grep } from './storage/search';
import { file, File } from './storage/file';
import { dir, Directory } from './storage/directory';
import {
  dirs,
  files,
  glob,
  ItemCollection,
  FileCollection,
  DirectoryCollection,
} from './storage/item-collection';
import { web } from './web';
import { clipboard } from './os/clipboard';
import * as arrayUtils from './utils/array';
import * as objectUtils from './utils/object';
import * as textUtils from './utils/text';
import * as metadataUtils from './utils/metadata';
import { cwd } from './shell/fn';
import { log } from './utils/log';
import { sol } from './sol';
import { edit } from './integrations/editor';
import { play, replay, unwatchPlay } from './play';
import * as shell from './shell/shelljs';
import { awaitSync } from './utils/async';
import {
  wrapObject,
  csvToData,
  jsonToData,
  yamlToData,
  wrapHtml,
  wrapXml,
  wrapString,
} from './data/mapper';
import { astTypes } from './data/ast';

export const globals = {
  ast: {
    help: 'Converts code to its AST to Data',
    value: csvToData,
  },
  astTypes: {
    help: 'See https://babeljs.io/docs/en/babel-types',
    value: astTypes,
  },
  awaitSync: {
    help: 'Waits for the given promise before continuing',
    value: awaitSync,
  },
  chalk: {
    help: 'See https://github.com/chalk/chalk#readme',
    value: chalk,
  },
  clipboard: {
    help: 'Exposes the system clipboard',
    value: clipboard,
  },
  csv: {
    help: 'Converts CSV to Data',
    value: csvToData,
  },
  cwd: {
    help: 'Returns the current working directory',
    value: cwd,
  },
  data: {
    help: 'Wraps the given object as Data',
    value: wrapObject,
  },
  dir: {
    help: 'Wrapper for directories',
    value: dir,
  },
  dirs: {
    help: 'Glob search for directories',
    value: dirs,
  },
  edit: {
    help: 'Opens a file for editing (defaults to code as editor)',
    value: edit,
  },
  fetch: {
    help:
      'Fetch content from the internet (compatible to NodeJS fetch arguments)',
    value: web.fetch,
  },
  file: {
    help: 'Wrapper for files',
    value: file,
  },
  files: {
    help: 'Glob search for files',
    value: files,
  },
  glob: {
    help: 'Glob search for files or directories',
    value: glob,
  },
  grep: {
    help: 'Finds files using the given RegExp pattern',
    value: grep,
  },
  html: {
    help: 'Converts HTML to Data',
    value: wrapHtml,
  },
  JSDOM: {
    help: 'See https://github.com/jsdom/jsdom',
    value: JSDOM,
  },
  json: {
    help: 'Converts JSON to Data',
    value: jsonToData,
  },
  jsonata: {
    help: 'See https://jsonata.org/',
    value: jsonata,
  },
  log: {
    help: 'Logs to the console',
    value: log,
  },
  play: {
    help: 'Opens a given play file for interactive editing',
    value: play,
  },
  replay: {
    value: replay,
  },
  shared: {
    help: 'Variables shared between play scripts and the shell',
    value: {},
  },
  shell: {
    help: 'Shell utilities',
    value: shell,
  },
  sol: {
    help: 'Current Sol instance',
    value: sol,
  },
  text: {
    help: 'Wraps a string as Text',
    value: wrapString,
  },
  unwatchPlay: {
    value: unwatchPlay,
  },
  web: {
    help: 'Utilities for internet access',
    value: web,
  },
  xml: {
    help: 'Converts XML to Data',
    value: wrapXml,
  },
  yaml: {
    help: 'Converts YAML to Data',
    value: yamlToData,
  },
  utils: {
    help: 'Basic utility functions',
    value: {
      ...metadataUtils,
      ...arrayUtils,
      ...objectUtils,
      ...textUtils,
    },
  },
  Directory: { help: 'Class used for wrapping directories', value: Directory },
  DirectoryCollection: {
    help: 'Class used for wrapping multiple directories',
    value: DirectoryCollection,
  },
  File: { help: 'Class used for wrapping files', value: File },
  FileCollection: {
    help: 'Class used for wrapping multiple files',
    value: FileCollection,
  },
  ItemCollection: {
    help: 'Class used for wrapping mutliple storage items',
    value: ItemCollection,
  },
};

export type Globals = typeof globals;
