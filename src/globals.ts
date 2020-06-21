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
import { jsonata } from './integrations/jsonata';
import { cheerio } from './integrations/cheerio';
import { chalk } from './integrations/chalk';
import { csv, Csv } from './data/csv';
import { html, Html } from './data/html';
import { json, Json } from './data/json';
import { xml, Xml } from './data/xml';
import { yaml, Yaml } from './data/yaml';
import { ast, astTypes, Ast } from './data/ast';
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
import { SolPropertyDescriptorMap } from './interfaces/properties';
import { awaitSync } from './utils/async';

export const globals: SolPropertyDescriptorMap = {
  ast: {
    help: 'Wrapper to expose the AST of a JS or TS file',
    value: ast,
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
  cheerio: {
    help: 'See https://github.com/cheeriojs/cheerio',
    value: cheerio,
  },
  clipboard: {
    help: 'Exposes the system clipboard',
    value: clipboard,
  },
  csv: {
    help: 'Wrapper for CSV content (accepts CSV strings and arrays)',
    value: csv,
  },
  cwd: {
    help: 'Returns the current working directory',
    value: cwd,
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
    help: 'Wrapper for HTML content (accepts HTML strings)',
    value: html,
  },
  json: {
    help: 'Wrapper for JSON content (accepts JSON strings and objects)',
    value: json,
  },
  jsonata: {
    help: 'Logs to the console',
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
  shell: {
    help: 'Shell utilities',
    value: shell,
  },
  sol: {
    help: 'Current Sol instance',
    value: sol,
  },
  unwatchPlay: {
    value: unwatchPlay,
  },
  web: {
    help: 'Utilities for internet access',
    value: web,
  },
  xml: {
    help: 'Wrapper for XML content (accepts XML string)',
    value: xml,
  },
  yaml: {
    help: 'Wrapper for YAML content (accepts YAML string or object)',
    value: yaml,
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
  Ast: { help: 'Class used by ast() wrapper', value: Ast },
  Csv: { help: 'Class used by csv() wrapper', value: Csv },
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
  Html: { help: 'Class used by html() wrapper', value: Html },
  ItemCollection: {
    help: 'Class used for wrapping mutliple storage items',
    value: ItemCollection,
  },
  Json: { help: 'Class used by json() wrapper', value: Json },
  Xml: { help: 'Class used by xml() wrapper', value: Xml },
  Yaml: { help: 'Class used by yaml() wrapper', value: Yaml },
};

export type Globals = typeof globals;
