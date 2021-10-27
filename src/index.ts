import { spawnSync } from 'child_process';
import { sol } from './modules/sol/sol';
import { log, logDebug } from './modules/utils/log';
import { extensions } from './modules/sol/extension';
import chalk from 'chalk';
import { workspace } from './modules/sol/workspace';
import { solReplColor } from './modules/sol/repl';

/**
 * Setup Sol modules
 */
export function setupSol(): void {
  require('./setup');
}

export function loadSol() {
  const { logDebug } = require('./modules/utils/log');

  logDebug('Loading Sol...');

  setupSol();

  const { workspace, userWorkspace } = require('./modules/sol/workspace');

  userWorkspace.load();
  workspace.load();

  // Update context files again
  userWorkspace.updateContextFile();
  workspace.updateContextFile();

  logDebug('Loaded Sol');
}

/**
 * Runs the build command for Sol
 */
export function rebuildSol(): void {
  const { sol } = require('./modules/sol/sol');

  spawnSync('npm run build', {
    cwd: sol.packageDir.path,
    shell: true,
  });
}

/**
 * Update Sol from git remote
 */
export function updateSol(): void {
  logDebug('Updating Sol...');
  logDebug('Fetching latest version from GitHub...');

  spawnSync('git pull --rebase', {
    cwd: sol.packageDir.path,
    shell: true,
  });

  spawnSync('npm install', {
    cwd: sol.packageDir.path,
    shell: true,
  });

  logDebug('Fetched latest version from GitHub');

  rebuildSol();

  logDebug('Updated Sol');
}

/**
 * Unloads Sol modules
 */
export function unloadSol(): void {
  const { logDebug } = require('./modules/utils/log');
  const {
    unmutateClass,
    unmutateGlobals,
  } = require('./modules/utils/mutation');
  const { clearRequireCache } = require('./modules/utils/module');
  const { extensions } = require('./modules/sol/extension');
  const { unwatchPlays } = require('./modules/play/play');
  const { workspace, userWorkspace } = require('./modules/sol/workspace');

  logDebug('Unloading Sol...');

  unwatchPlays();

  unmutateGlobals(global);
  unmutateClass(Array);
  unmutateClass(String);
  unmutateClass(Number);
  unmutateClass(Date);
  unmutateClass(Error);
  unmutateClass(Object);
  unmutateClass(Promise);

  const { sol } = require('./modules/sol/sol');
  const modules = [
    ...sol.packageDistDir
      .files('**/*.js')
      .value.map((f: any) => f.pathWithoutExt),
    ...workspace.dir
      .files('**/*.{ts,js}')
      .value.map((f: any) => f.pathWithoutExt),
    ...userWorkspace.dir
      .files('**/*.{ts,js}')
      .value.map((f: any) => f.pathWithoutExt),
    ...extensions
      .filter((e: any) => e.loaded)
      .flatMap((extension: any) =>
        extension.dir
          .files('**/*.{ts,js}')
          .value.map((f: any) => f.pathWithoutExt),
      ),
  ];

  modules.forEach(clearRequireCache);

  logDebug('Unloaded Sol');
}

/**
 * Unloads Sol and reload it again afterwards
 */
export function reloadSol(): void {
  unloadSol();
  loadSol();
}

/**
 * Start Sol REPL server
 */
export function startSol(): void {
  loadSol();

  const { startReplServer } = require('./modules/sol/repl');

  const server = startReplServer();

  server.defineCommand('rebuild', {
    help: 'Rebuilds and reloads Sol using the current source files',
    action() {
      rebuildSol();
      reloadSol();
      server.close();

      setTimeout(() => {
        startSol();
      }, 0);
    },
  });

  server.defineCommand('reload', {
    help: 'Reloads Sol files to reflect latest build',
    action() {
      reloadSol();
      server.close();

      setTimeout(() => {
        startSol();
      }, 0);
    },
  });

  server.defineCommand('update', {
    help: 'Update Sol to latest version',
    action() {
      updateSol();
      server.close();

      setTimeout(() => {
        startSol();
      }, 0);
    },
  });

  const loadedExtensions = extensions.filter((e) => e.loaded);

  log(
    `
${chalk.bold(solReplColor.primary('-=| Welcome to Sol |=-'))}
Workspace: ${solReplColor.warn(workspace.dir)}${
      loadedExtensions.length
        ? `
Extensions:
${loadedExtensions
  .map((e) => `- ${solReplColor.ok(e.name)} (${solReplColor.warn(e.dir.path)})`)
  .join('\n')}`
        : ''
    }

Use ${solReplColor.primary(
      '.globals [filter]',
    )} to find out more about your options.

To enable additional extensions, load them in your workspace or user ${solReplColor.warn(
      'setup.ts',
    )} file (e.g. using ${solReplColor.primary('workspace.setupFile.edit()')}).
You can create a new one by calling either ${solReplColor.primary(
      "workspaceExtension('your-name').edit()",
    )} or ${solReplColor.primary("userExtension('your-name').edit()")}.

For usage details see: ${solReplColor.warn(`${sol.packageDir.path}/README.md`)}
`.trimEnd(),
  );

  server.displayPrompt();
}
