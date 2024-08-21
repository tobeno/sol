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
        `
CLI arguments passed to Sol passed after --.

Usage:
> args.first // e.g. for 'sol -- arg1 arg2'
`,
      );
    },
  },
  astTypes: {
    get() {
      return withHelp(
        require('@babel/types'),
        `
AST type utilities from Babel to create or check AST nodes.

See: https://babeljs.io/docs/en/babel-types`,
      );
    },
  },
  chalk: {
    value: withHelp(
      chalk,
      `
Chalk CLI coloring.

See: https://github.com/chalk/chalk#readme
`,
    ),
  },
  cwd: {
    get() {
      return withHelp(
        Directory.create(getCwd()),
        `
Current working directory.

Usage:
> cwd.open()
> cwd.files('*.md')
`,
      );
    },
  },
  data: {
    value: withHelp(
      Data.create,
      `
Wraps the given value as Data.
   
Usage:
${Data.usageHelp}
`,
    ),
  },
  day: {
    get() {
      return withHelp(
        day,
        `
  DayJS date manipulation library.
  
  Usage:
  > day().format('YYYY-MM-DD')
  > day('2021-01-01').add(1, 'day')
  > day(1318781876406).toDate()
  
  See https://day.js.org/docs/en/installation/installation`,
      );
    },
  },
  dir: {
    value: withHelp(
      Directory.create,
      `
Creates a Directory wrapper for the given path.

Usage:
${Directory.usageHelp}
`,
    ),
  },
  dirs: {
    value: withHelp(
      dirs,
      `
Directories matching the given glob pattern.

Usage:
> dirs('**/mutations')
`,
    ),
  },
  env: {
    get() {
      return withHelp(
        Data.create(getEnv()),
        `
Environment variables.

Usage:
> env.keys.sorted
`,
      );
    },
  },
  exec: {
    get() {
      const shell = Shell.create();

      return withHelp(
        shell.exec.bind(shell),
        `
Executes the given command.

Usage:
> exec('ls -la').lines.first
`,
      );
    },
  },
  fake: {
    get() {
      return withHelp(
        require('@ngneat/falso') as typeof import('@ngneat/falso'),
        `
Helper functions to quickly generate fake data using falso.

Usage:
> fake.randBook().author

See: https://ngneat.github.io/falso/docs/getting-started`,
      );
    },
  },

  file: withHelp(
    {
      value: File.create,
    },
    `
Creates a File wrapper for the given path.

Usage:
${File.usageHelp}
`,
  ),
  fileCached: {
    value: withHelp(
      fileCached,
      `
Cache the return value of the given function in a file.

Usage:
> fileCached('number.json', () => Math.random()).await
> fileCached('html.json', async () => web.get('https://www.google.com').await.content.value).await.text.html.select('title').content
`,
    ),
  },
  files: {
    value: withHelp(
      files,
      `
Files matching the given glob pattern.

Usage:
> files('*.md')
`,
    ),
  },
  glob: {
    value: withHelp(
      glob,
      `
Files or directories matching the given glob pattern.

Usage:
> glob('.*')
`,
    ),
  },
  grep: {
    value: withHelp(
      grepFiles,
      `
Finds files using the given RegExp pattern.

Usage:
> grep('dayjs').files('*.json')
> grep(/day[j]/).files('*.ts')
`,
    ),
  },
  html: {
    value: withHelp(
      Html.create,
      `
Creates a Html wrapper for the given text.

Usage:
${Html.usageHelp}
      `,
    ),
  },
  jsonata: {
    get() {
      return withHelp(
        require('jsonata') as typeof import('jsonata'),
        `
jsonata selector engine.

Usage:
> jsonata('a[0]').evaluate({ a: [1, 2], b: [3, 4] })

See: https://jsonata.org`,
      );
    },
  },
  jwt: {
    get() {
      return withHelp(
        {
          ...jwt,
        },
        'See https://github.com/auth0/node-jsonwebtoken#readme.',
      );
    },
  },
  log: {
    value: withHelp(
      log,
      `
Logs to the console.

Usage:
> log('Hello!')
`,
    ),
  },
  markdown: {
    value: withHelp(
      Markdown.create,
      `
Creates a Markdown wrapper around the given markdown string.

Usage:
> markdown('# Title').html.browse()
`,
    ),
  },
  morph: {
    get() {
      return withHelp(
        require('ts-morph') as typeof import('ts-morph'),
        `
ts-morph transformation library.
        
See: https://ts-morph.com
`,
      );
    },
  },
  morphProject: {
    get() {
      return withHelp(
        morphProject,
        `
Runs ts-morph for the current working directory using the given callback function.

Usage:
> morphProject((p) => { log(p.getSourceFiles("src/**/*.ts").map(f => f.getClasses()).flat().map(c => c.getName()).sort()) })
        
See: https://ts-morph.com
`,
      );
    },
  },
  omit: {
    get() {
      return withHelp(
        require('lodash/omit'),
        `
Omit helper function from lodash.js.
        
See: https://lodash.com/docs/latest#omit
`,
      );
    },
  },
  open: {
    value: withHelp(
      open,
      `
Opens the given file or URL.

Usage:
> open('https://www.google.com')
> open('README.md', 'code')
`,
    ),
  },
  openApp: {
    value: withHelp(
      openApp,
      `
Opens the given app.

Usage:
> open('Visual Studio Code')
`,
    ),
  },
  pick: {
    get() {
      return withHelp(
        require('lodash/pick'),
        `
Omit helper function from lodash.js.
        
See: https://lodash.com/docs/latest#pick
`,
      );
    },
  },
  printHelp: {
    value: withHelp(printHelp, 'Prints the help text for the given argument.'),
  },
  prompts: {
    get() {
      return withHelp(
        require('@inquirer/prompts') as typeof import('@inquirer/prompts'),
        `
Multiple prompts to use to gather user input.

Usage:
> prompts.input({ message: 'Enter text' })
> prompts.select({ message: 'Select country', choices: [{ value: 'de', name: 'Germany' }, { value: 'at', name: 'Austria' }] })

See: https://github.com/SBoudrias/Inquirer.js.
`,
      );
    },
  },
  runtimeCached: {
    value: withHelp(
      runtimeCached,
      `
Cache the return value of the given function in a runtime variable.

Usage:
> runtimeCached('number.json', () => Math.random()).await
> runtimeCached('html.json', async () => web.get('https://www.google.com').await.content.value).await.text.html.select('title').content
`,
    ),
  },
  shared: {
    value: withHelp(
      {},
      `
Variables shared between play scripts and the shell.

Usage:
> shared.someVariable = 'test'
`,
    ),
  },
  shell: {
    value: withHelp(
      Shell.create,
      `
Creates a Shell wrapper for the given directory.

Usage:
> shell().exec('ls -la').lines.first
> shell('./src').ls()
`,
    ),
  },
  sol: {
    get() {
      return withHelp(
        require('../index') as typeof import('../index'),
        `
Sol globals (to access e.g. classes for wrappers).

Usage:
> sol.Text.create('test').uppercased
 `,
      );
    },
  },
  solExtension: {
    value: withHelp(
      solExtension,
      `
Returns the Sol extension for the given name or path.
`,
    ),
  },
  solExtensions: {
    get() {
      return withHelp(
        getSolExtensions(),
        `
Returns known sol extensions.
`,
      );
    },
  },
  solPackage: {
    get() {
      return withHelp(
        getSolPackage(),
        `
Returns the Sol package.

Usage:
> solPackage.edit()
`,
      );
    },
  },
  solUserExtension: {
    value: withHelp(
      solUserExtension,
      `
Returns the user extension for the given name.
`,
    ),
  },
  solUserWorkspace: {
    get() {
      return withHelp(
        getSolUserWorkspace(),
        `
User Sol workspace (~/.sol).

Usage:
> solUserWorkspace.envFile.edit()
`,
      );
    },
  },
  solWorkspace: {
    get() {
      return withHelp(
        getCurrentSolWorkspace(),
        `
Current Sol workspace (./.sol).

Usage:
> solUserWorkspace.envFile.edit()
`,
      );
    },
  },
  solWorkspaceExtension: {
    value: withHelp(
      solWorkspaceExtension,
      `
Returns the workspace extension for the given name.
`,
    ),
  },
  text: {
    value: withHelp(
      Text.create,
      `
Creates a Text wrapper around the given string.

Usage:
${Text.usageHelp}
`,
    ),
  },
  tmpDir: {
    value: withHelp(
      TmpDirectory.create,
      `
Creates a temporary directory.

Usage:
> tmpDir().file('test.md').md = '# Title'
`,
    ),
  },
  tmpFile: {
    value: withHelp(
      TmpFile.create,
      `
Creates a temporary file.

Usage:
${TmpFile.usageHelp}
`,
    ),
  },
  url: {
    value: withHelp(
      Url.create,
      `
Creates an Url wrapper around the given URL string.

Usage:
> url('https://www.google.com').get().await.content
> url('https://www.google.com').hostname.uppercased
> url('https://www.google.com').hostname = 'www.bing.com'
    `,
    ),
  },
  web: {
    value: withHelp(web, 'Utilities for internet access.'),
  },
  withHelp: {
    value: withHelp,
  },
  xml: {
    value: withHelp(Xml.create, 'Wraps a string as Xml.'),
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
