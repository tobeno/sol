/**
 * Mutation for the global scope.
 */

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
import { open, openApp } from '../../../utils/open';
import { getPlays, play, playFile, replay } from '../../play/play';
import type * as shell from '../../../utils/sh';
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
import { web } from '../../web/web';
import { FromPropertyDescriptorMap } from '../../../interfaces/object';
import { Markdown } from '../../data/markdown';
import { getSolPackage } from '../../sol/sol-package';
import { fileCached, runtimeCached } from '../../../utils/cache';
import { Html } from '../../data/html';
import { Xml } from '../../data/xml';
import { Chart } from '../../visualize/chart';
import { TmpFile } from '../../storage/tmp-file';
import { TmpDirectory } from '../../storage/tmp-directory';
import { Image } from '../../image/image';
import { getAi } from '../../ai/ai';
import { Graph } from '../../visualize/graph';

export const globals = {
  ai: withHelp(
    {
      get() {
        return getAi();
      },
    },
    'AI integration',
  ),
  args: withHelp(
    {
      get() {
        return Data.create(
          process.argv.slice(2).filter((arg) => !arg.startsWith('-')),
        );
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
  chart: withHelp(
    {
      value: Chart.create,
    },
    'See https://apexcharts.com/docs/series/',
  ),
  classes: withHelp(
    {
      get(): typeof classes {
        return Data.create(require('../globals/classes.global')).sorted.value;
      },
    },
    'Classes',
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
        return require('../../../utils/day').day;
      },
    },
    'See https://day.js.org/docs/en/installation/installation',
  ),
  debug: withHelp(
    {
      get() {
        return {
          ...require('../../../utils/debug'),
        };
      },
    },
    'Debug utils',
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
  fake: withHelp(
    {
      get() {
        return require('@ngneat/falso') as typeof import('@ngneat/falso');
      },
    },
    'See https://ngneat.github.io/falso/docs/getting-started',
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
  fileCached: withHelp(
    {
      value: fileCached,
    },
    'Cache the return value of the given function in a file',
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
  graph: withHelp(
    {
      value: Graph.create,
    },
    'Wrapper for Mermaid graphs',
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
  image: withHelp(
    {
      value(imageOrFile: Image | Buffer | File | string): Image {
        if (imageOrFile instanceof Buffer || imageOrFile instanceof Image) {
          return Image.create(imageOrFile);
        }

        return File.create(imageOrFile).image;
      },
    },
    'Wraps the given image file as Image',
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
        return require('../../../utils/jwt').jwt;
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
  morph: withHelp(
    {
      get() {
        return require('ts-morph') as typeof import('ts-morph');
      },
    },
    'See: https://ts-morph.com',
  ),
  morphProject: withHelp(
    {
      get() {
        return require('../../../utils/morph').morphProject;
      },
    },
    'Returns ts-morph project for the current working directory',
  ),
  omit: withHelp(
    {
      get() {
        return require('lodash/omit');
      },
    },
    'See: https://lodash.com/docs/latest#omit',
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
  pick: withHelp(
    {
      get() {
        return require('lodash/pick');
      },
    },
    'See: https://lodash.com/docs/latest#pick',
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
        return getPlays();
      },
    },
    'Returns available play files',
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
  sh: withHelp(
    {
      get(): typeof shell {
        return require('../../../utils/sh');
      },
    },
    'Shell utilities',
  ),
  shared: withHelp(
    {
      value: {},
    },
    'Variables shared between play scripts and the shell',
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
  tmpDir: withHelp(
    {
      value: TmpDirectory.create,
    },
    'Temporary directory',
  ),
  tmpFile: withHelp(
    {
      value: TmpFile.create,
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
  const ai: Globals['ai'];
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
  const debug: Globals['debug'];
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
  const morph: Globals['morph'];
  const morphProject: Globals['morphProject'];
  const omit: Globals['omit'];
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
  const tmpDir: Globals['tmpDir'];
  const tmpFile: Globals['tmpFile'];
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
