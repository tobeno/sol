import { spawnSync } from 'child_process';
import chalk from 'chalk';
import { clearRequireCache } from './modules/utils/module';

/**
 * Setup Sol modules
 */
export function setupSol(): void {
  require('./setup');
}

export function loadSol(): void {
  const { logDebug } = require('./modules/utils/log');

  logDebug('Loading Sol...');

  setupSol();

  const {
    getCurrentWorkspace,
    getUserWorkspace,
  } = require('./modules/sol/workspace');

  const workspace = getCurrentWorkspace();
  const userWorkspace = getUserWorkspace();

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
  const { getSol } = require('./modules/sol/sol');

  spawnSync('npm run build', {
    cwd: getSol().packageDir.path,
    shell: true,
  });
}

/**
 * Update Sol from git remote
 */
export function updateSol(): void {
  const { logDebug } = require('./modules/utils/log');

  logDebug('Updating Sol...');
  logDebug('Fetching latest version from GitHub...');

  const { getSol } = require('./modules/sol/sol');

  const sol = getSol();

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
  const { unwatchPlays } = require('./modules/play/play');

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

  clearRequireCache();

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

  const { startReplServer, solReplColor } = require('./modules/sol/repl');

  const server = startReplServer();

  server.defineCommand('rebuild', {
    help: 'Rebuilds and reloads Sol using the current source files',
    action(): void {
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
    action(): void {
      reloadSol();
      server.close();

      setTimeout(() => {
        startSol();
      }, 0);
    },
  });

  server.defineCommand('update', {
    help: 'Update Sol to latest version',
    action(): void {
      updateSol();
      server.close();

      setTimeout(() => {
        startSol();
      }, 0);
    },
  });

  const { getSol } = require('./modules/sol/sol');
  const { getLoadedExtensions } = require('./modules/sol/extension');
  const { log } = require('./modules/utils/log');
  const { getCurrentWorkspaceDir } = require('./modules/sol/workspace');

  const loadedExtensions = getLoadedExtensions();
  const sol = getSol();

  log(
    `
${chalk.bold(solReplColor.primary('-=| Welcome to Sol |=-'))}
Workspace: ${solReplColor.warn(getCurrentWorkspaceDir().path)}${
      loadedExtensions.length
        ? `
Extensions:
${loadedExtensions
  .map(
    (e: any) =>
      `- ${solReplColor.ok(e.name)} (${solReplColor.warn(e.dir.path)})`,
  )
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
