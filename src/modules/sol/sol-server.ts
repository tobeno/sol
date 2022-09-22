import { spawnSync } from 'child_process';
import chalk from 'chalk';
import { clearRequireCache } from '../../utils/module';

/**
 * Setup Sol modules
 */
export function setupSol(): void {
  require('../../setup');
}

export function loadSol(): void {
  const { logDebug } = require('../../utils/log');

  logDebug('Loading Sol...');

  setupSol();

  const {
    getCurrentSolWorkspace,
    getSolUserWorkspace,
  } = require('./sol-workspace');

  const workspace = getCurrentSolWorkspace();
  const userWorkspace = getSolUserWorkspace();

  userWorkspace.load();
  workspace.load();

  // Update context files again
  userWorkspace.updateContextFile();
  workspace.updateContextFile();

  logDebug('Loaded Sol');
}

/**
 * Update Sol from git remote
 */
export function updateSol(): void {
  const { logDebug } = require('../../utils/log');

  logDebug('Updating Sol...');
  logDebug('Fetching latest version from GitHub...');

  const { getSol } = require('./sol');

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

  logDebug('Updated Sol');
}

/**
 * Unloads Sol modules
 */
export function unloadSol(): void {
  const { logDebug } = require('../../utils/log');
  const { unmutateClass, unmutateGlobals } = require('../../utils/mutation');
  const { unplay } = require('../play/play');
  logDebug('Unloading Sol...');

  unplay();

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

  const { startSolReplServer, solReplColor } = require('./sol-repl');

  const server = startSolReplServer();

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

  const { getSol } = require('./sol');
  const { getLoadedSolExtensions } = require('./sol-extension');
  const { log } = require('../../utils/log');
  const { getCurrentSolWorkspaceDir } = require('./sol-workspace');

  const loadedExtensions = getLoadedSolExtensions();
  const sol = getSol();

  log(
    `
${chalk.bold(solReplColor.primary('-=| Welcome to Sol |=-'))}
Workspace: ${solReplColor.warn(getCurrentSolWorkspaceDir().path)}${
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
    )} file (e.g. using ${solReplColor.primary(
      'solWorkspace.setupFile.edit()',
    )}).
You can create a new one by calling either ${solReplColor.primary(
      "solWorkspaceExtension('your-name').edit()",
    )} or ${solReplColor.primary("solUserExtension('your-name').edit()")}.

For usage details see: ${solReplColor.warn(`${sol.packageDir.path}/README.md`)}
`.trimEnd(),
  );

  server.displayPrompt();
}
