/**
 * Mutation for the global scope.
 */

import chalk from 'chalk';
import type { FromPropertyDescriptorMap } from '../interfaces/object.interfaces';
import {
  getSolExtensions,
  solExtension,
  solUserExtension,
  solWorkspaceExtension,
} from '../sol/sol-extension';
import { getSolPackage } from '../sol/sol-package';
import {
  getCurrentSolWorkspace,
  getSolUserWorkspace,
} from '../sol/sol-workspace';
import { awaitSync } from '../utils/async.utils';
import { fileCached, runtimeCached } from '../utils/cache.utils';
import { getCwd, getEnv } from '../utils/env.utils';
import { log } from '../utils/log.utils';
import { withHelp } from '../utils/metadata.utils';
import {
  definePropertiesMutation,
  mutateGlobals,
} from '../utils/mutation.utils';
import { open, openApp } from '../utils/open.utils';
import { dirs, files, glob, grepFiles } from '../utils/search.utils';
import { web } from '../utils/web.utils';
import { Data } from '../wrappers/data.wrapper';
import { Directory } from '../wrappers/directory.wrapper';
import { File } from '../wrappers/file.wrapper';
import { Html } from '../wrappers/html.wrapper';
import { Markdown } from '../wrappers/markdown.wrapper';
import { Text } from '../wrappers/text.wrapper';
import { TmpDirectory } from '../wrappers/tmp-directory.wrapper';
import { TmpFile } from '../wrappers/tmp-file.wrapper';
import { Url } from '../wrappers/url.wrapper';
import { Xml } from '../wrappers/xml.wrapper';
import { Shell } from '../wrappers/shell.wrapper';

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
        return require('../utils/day.utils').day;
      },
    },
    'See https://day.js.org/docs/en/installation/installation',
  ),
  debug: withHelp(
    {
      get() {
        return {
          ...require('../utils/debug.utils'),
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
      value: grepFiles,
    },
    'Finds files using the given RegExp pattern',
  ),
  html: withHelp(
    {
      value: Html.create,
    },
    'Wraps the given string as Html',
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
        return require('../utils/jwt.utils').jwt;
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
        return require('../utils/morph.utils').morphProject;
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
  shared: withHelp(
    {
      value: {},
    },
    'Variables shared between play scripts and the shell',
  ),
  shell: withHelp(
    {
      value: Shell.create,
    },
    'Creates a new Shell wrapper for the given directory',
  ),
  sol: withHelp(
    {
      get() {
        return require('../index');
      },
    },
    'Returns the extension for the given name or path',
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
  const shell: Globals['shell'];
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
  const web: Globals['web'];
  const withHelp: Globals['withHelp'];

  // DOM globals
  type BufferSource = any;
  type FormData = any;
}

mutateGlobals(definePropertiesMutation(globals));
