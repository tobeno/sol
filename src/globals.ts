import * as jsonata from 'jsonata';
import { JSDOM } from 'jsdom';
import * as chalk from 'chalk';
import * as R from 'remeda';
import { grep } from './storage/search';
import { file, File } from './storage/file';
import { dir, Directory } from './storage/directory';
import {
  DirectoryCollection,
  dirs,
  FileCollection,
  files,
  glob,
  ItemCollection,
} from './storage/item-collection';
import { web } from './web';
import { clipboard } from './os/clipboard';
import * as asyncUtils from './utils/async';
import { awaitSync } from './utils/async';
import * as arrayUtils from './utils/array';
import * as objectUtils from './utils/object';
import * as textUtils from './utils/text';
import * as metadataUtils from './utils/metadata';
import { withHelp } from './utils/metadata';
import { cwd } from './shell/fn';
import { log } from './utils/log';
import { sol } from './sol';
import { edit } from './integrations/editor';
import { play, replay, unwatchPlay } from './play';
import * as shell from './shell/shelljs';
import {
  csvToData,
  jsonToData,
  transform,
  wrapHtml,
  wrapObject,
  wrapString,
  wrapXml,
  yamlToData,
} from './data/transformer';
import { astTypes } from './data/ast';
import { DataType } from './data/data-type';
import { DataFormat } from './data/data-format';
import { DataTransformation } from './data/data-transformation';

export const globals = {
  ast: withHelp(csvToData, 'Converts code to its AST to Data'),
  astTypes: withHelp(astTypes, 'See https://babeljs.io/docs/en/babel-types'),
  awaitSync: withHelp(
    awaitSync,
    'Waits for the given promise before continuing',
  ),
  chalk: withHelp(chalk, 'See https://github.com/chalk/chalk#readme'),
  clipboard: withHelp(clipboard, 'Exposes the system clipboard'),
  csv: withHelp(csvToData, 'Converts CSV to Data'),
  cwd: withHelp(cwd, 'Returns the current working directory'),
  data: withHelp(wrapObject, 'Wraps the given object as Data'),
  dir: withHelp(dir, 'Wrapper for directories'),
  dirs: withHelp(dirs, 'Glob search for directories'),
  edit: withHelp(edit, 'Opens a file for editing (defaults to code as editor)'),
  file: withHelp(file, 'Wrapper for files'),
  files: withHelp(files, 'Glob search for files'),
  glob: withHelp(glob, 'Glob search for files or directories'),
  grep: withHelp(grep, 'Finds files using the given RegExp pattern'),
  html: withHelp(wrapHtml, 'Converts HTML to Data'),
  JSDOM: withHelp(JSDOM, 'See https://github.com/jsdom/jsdom'),
  json: withHelp(jsonToData, 'Converts JSON to Data'),
  jsonata: withHelp(jsonata, 'See https://jsonata.org/'),
  log: withHelp(log, 'Logs to the console'),
  pipe: withHelp(R.pipe, 'Pipe helper from Remeda'),
  play: withHelp(play, 'Opens a given play file for interactive editing'),
  replay,
  shared: withHelp({}, 'Variables shared between play scripts and the shell'),
  shell: withHelp(shell, 'Shell utilities'),
  sol: withHelp(sol, 'Current Sol instance'),
  text: withHelp(wrapString, 'Wraps a string as Text'),
  transform: withHelp(
    transform,
    'Transforms data between data types using transformations',
  ),
  unwatchPlay,
  web: withHelp(web, 'Utilities for internet access'),
  xml: withHelp(wrapXml, 'Converts XML to Data'),
  yaml: withHelp(yamlToData, 'Converts YAML to Data'),
  utils: withHelp(
    {
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
    'Basic utility functions',
  ),
  R: withHelp(R, 'Remeda'),
};

export type Globals = typeof globals;
