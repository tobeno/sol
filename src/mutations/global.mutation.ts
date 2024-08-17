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
import { fileCached, runtimeCached } from '../utils/cache.utils';
import { getCwd, getEnv } from '../utils/env.utils';
import { log } from '../utils/log.utils';
import { printHelp, withHelp } from '../utils/metadata.utils';
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
import { Shell } from '../wrappers/shell.wrapper';
import { Text } from '../wrappers/text.wrapper';
import { TmpDirectory } from '../wrappers/tmp-directory.wrapper';
import { TmpFile } from '../wrappers/tmp-file.wrapper';
import { Url } from '../wrappers/url.wrapper';
import { day } from '../utils/day.utils';
import { morphProject } from '../utils/morph.utils';
import { Xml } from '../wrappers/xml.wrapper';
import module from 'node:module';
import { jwt } from '../utils/jwt.utils';

const require = module.createRequire(import.meta.url);

export const globals = {
  args: {
    get() {
      return withHelp(
        Data.create(
          process.argv.slice(2).filter((arg) => !arg.startsWith('-')),
        ),
        'Returns the arguments passed to Sol',
      );
    },
  },
  astTypes: {
    get() {
      return withHelp(
        require('@babel/types'),
        'See https://babeljs.io/docs/en/babel-types',
      );
    },
  },
  chalk: {
    value: withHelp(chalk, 'See https://github.com/chalk/chalk#readme'),
  },
  cwd: {
    get() {
      return withHelp(
        Directory.create(getCwd()),
        'Returns the current working directory',
      );
    },
  },
  data: {
    value: withHelp(Data.create, 'Wraps the given object as Data'),
  },
  day: {
    get() {
      return withHelp(
        { ...day },
        'See https://day.js.org/docs/en/installation/installation',
      );
    },
  },
  dir: {
    value: withHelp(Directory.create, 'Wrapper for directories'),
  },
  dirs: {
    value: withHelp(dirs, 'Glob search for directories'),
  },
  env: {
    get() {
      return withHelp(
        {
          ...getEnv(),
        },
        'Returns the environment variables',
      );
    },
  },
  exec: {
    get() {
      const shell = Shell.create();

      return withHelp(shell.exec.bind(shell), 'Executes the given command');
    },
  },
  fake: {
    get() {
      return withHelp(
        require('@ngneat/falso') as typeof import('@ngneat/falso'),
        'See https://ngneat.github.io/falso/docs/getting-started',
      );
    },
  },
  fetch: {
    value: withHelp(web.fetch, 'HTTP fetch compatible to node-fetch'),
  },

  file: withHelp(
    {
      value: File.create,
    },
    'Wrapper for files',
  ),
  fileCached: {
    value: withHelp(
      fileCached,
      'Cache the return value of the given function in a file',
    ),
  },
  files: {
    value: withHelp(files, 'Glob search for files'),
  },
  glob: {
    value: withHelp(glob, 'Glob search for files or directories'),
  },
  grep: {
    value: withHelp(grepFiles, 'Finds files using the given RegExp pattern'),
  },
  html: {
    value: withHelp(Html.create, 'Wraps the given string as Html'),
  },
  jsonata: {
    get() {
      return withHelp(
        require('jsonata') as typeof import('jsonata'),
        'See https://jsonata.org/',
      );
    },
  },
  jwt: {
    get() {
      return withHelp(
        {
          ...jwt,
        },
        'See https://github.com/auth0/node-jsonwebtoken#readme',
      );
    },
  },
  log: {
    value: withHelp(log, 'Logs to the console'),
  },
  markdown: {
    value: withHelp(Markdown.create, 'Wraps the given string as Markdown'),
  },
  morph: {
    get() {
      return withHelp(
        require('ts-morph') as typeof import('ts-morph'),
        'See: https://ts-morph.com',
      );
    },
  },
  morphProject: {
    get() {
      return withHelp(
        morphProject,
        'Returns ts-morph project for the current working directory',
      );
    },
  },
  omit: {
    get() {
      return withHelp(
        require('lodash/omit'),
        'See: https://lodash.com/docs/latest#omit',
      );
    },
  },
  open: {
    value: withHelp(open, 'Opens the given file or URL'),
  },
  openApp: {
    value: withHelp(openApp, 'Opens the given app'),
  },
  pick: {
    get() {
      return withHelp(
        require('lodash/pick'),
        'See: https://lodash.com/docs/latest#pick',
      );
    },
  },
  printHelp: {
    value: withHelp(printHelp, 'Prints the help text for the given argument'),
  },
  prompts: {
    get() {
      return withHelp(
        require('@inquirer/prompts') as typeof import('@inquirer/prompts'),
        'See: https://github.com/SBoudrias/Inquirer.js',
      );
    },
  },
  runtimeCached: {
    value: withHelp(
      runtimeCached,
      'Cache the return value of the given function in a runtime variable',
    ),
  },
  shared: {
    value: withHelp({}, 'Variables shared between play scripts and the shell'),
  },
  shell: {
    value: withHelp(
      Shell.create,
      'Creates a new Shell wrapper for the given directory',
    ),
  },
  sol: {
    get() {
      return withHelp(
        require('../index') as typeof import('../index'),
        'Returns all sol globals',
      );
    },
  },
  solExtension: {
    value: withHelp(
      solExtension,
      'Returns the extension for the given name or path',
    ),
  },
  solExtensions: {
    get() {
      return withHelp(getSolExtensions(), 'Returns known sol extensions');
    },
  },
  solPackage: {
    get() {
      return withHelp(getSolPackage(), 'Returns the Sol package');
    },
  },
  solUserExtension: {
    value: withHelp(
      solUserExtension,
      'Returns the user extension for the given name',
    ),
  },
  solUserWorkspace: {
    get() {
      return withHelp(getSolUserWorkspace(), 'User Sol workspace');
    },
  },
  solWorkspace: {
    get() {
      return withHelp(getCurrentSolWorkspace(), 'Current Sol workspace');
    },
  },
  solWorkspaceExtension: {
    value: withHelp(
      solWorkspaceExtension,
      'Returns the workspace extension for the given name',
    ),
  },
  text: {
    value: withHelp(Text.create, 'Wraps a string as Text'),
  },
  tmpDir: {
    value: withHelp(TmpDirectory.create, 'Temporary directory'),
  },
  tmpFile: {
    value: withHelp(TmpFile.create, 'Temporary file'),
  },
  url: {
    value: withHelp(Url.create, 'Wraps a string as Url'),
  },
  web: {
    value: withHelp(web, 'Utilities for internet access'),
  },
  withHelp: {
    value: withHelp,
  },
  xml: {
    value: withHelp(Xml.create, 'Wraps a string as Xml'),
  },
};

export type Globals = FromPropertyDescriptorMap<typeof globals>;

declare global {
  const args: Globals['args'];
  const astTypes: Globals['astTypes'];
  const chalk: Globals['chalk'];
  const cwd: Globals['cwd'];
  const data: Globals['data'];
  const day: Globals['day'];
  const dir: Globals['dir'];
  const dirs: Globals['dirs'];
  const env: Globals['env'];
  const exec: Globals['exec'];
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
  const pick: Globals['pick'];
  const printHelp: Globals['printHelp'];
  const prompts: Globals['prompts'];
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
}

mutateGlobals(definePropertiesMutation(globals));
