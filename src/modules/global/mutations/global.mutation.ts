/**
 * Mutation for the global scope.
 */

import chalk from 'chalk';
import { FromPropertyDescriptorMap } from '../../../interfaces/object';
import {
  getSolExtensions,
  solExtension,
  solUserExtension,
  solWorkspaceExtension,
} from '../../../sol/sol-extension';
import { getSolPackage } from '../../../sol/sol-package';
import {
  getCurrentSolWorkspace,
  getSolUserWorkspace,
} from '../../../sol/sol-workspace';
import { awaitSync } from '../../../utils/async';
import { fileCached, runtimeCached } from '../../../utils/cache';
import { getCwd, getEnv } from '../../../utils/env';
import { log } from '../../../utils/log';
import { withHelp } from '../../../utils/metadata';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../../../utils/mutation';
import { open, openApp } from '../../../utils/open';
import { dirs, files, glob, grep } from '../../../utils/search';
import type * as shell from '../../../utils/sh';
import { web } from '../../../utils/web';
import { Data } from '../../../wrappers/data';
import { Directory } from '../../../wrappers/directory';
import { File } from '../../../wrappers/file';
import { Html } from '../../../wrappers/html';
import { Markdown } from '../../../wrappers/markdown';
import { Text } from '../../../wrappers/text';
import { TmpDirectory } from '../../../wrappers/tmp-directory';
import { TmpFile } from '../../../wrappers/tmp-file';
import { Url } from '../../../wrappers/url';
import { Xml } from '../../../wrappers/xml';
import { Image } from '../../image/wrappers/image';
import type * as classes from '../globals/classes.global';
import type * as utils from '../globals/utils.global';

export const globals = {
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
  chalk: withHelp(
    {
      value: chalk,
    },
    'See https://github.com/chalk/chalk#readme',
  ),
  classes: withHelp(
    {
      get(): typeof classes {
        return Data.create(require('../globals/classes.global')).sorted.value;
      },
    },
    'Classes',
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
  jsonata: withHelp(
    {
      get() {
        return require('jsonata') as typeof import('jsonata');
      },
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
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const args: Globals['args'];
  const astTypes: Globals['astTypes'];
  const awaitSync: Globals['awaitSync'];
  const chalk: Globals['chalk'];
  const cwd: Globals['cwd'];
  const data: Globals['data'];
  const day: Globals['day'];
  const debug: Globals['debug'];
  const dir: Globals['dir'];
  const dirs: Globals['dirs'];
  const env: Globals['env'];
  const file: Globals['file'];
  const files: Globals['files'];
  const fileCached: Globals['fileCached'];
  const glob: Globals['glob'];
  const grep: Globals['grep'];
  const jsonata: Globals['jsonata'];
  const log: Globals['log'];
  const morph: Globals['morph'];
  const morphProject: Globals['morphProject'];
  const omit: Globals['omit'];
  const open: Globals['open'];
  const openApp: Globals['openApp'];
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
  const url: Globals['url'];
  const classes: Globals['classes'];
  const utils: Globals['utils'];
  const web: Globals['web'];
  const withHelp: Globals['withHelp'];

  // DOM globals
  type BufferSource = any;
  type FormData = any;
}

mutateGlobals(definePropertiesMutation(globals));
