import { spawnSync } from 'child_process';
import chalk from 'chalk';
import { clearRequireCache } from '../../utils/module';

export function loadSol(): void {
  const { logDebug } = require('../../utils/log');

  logDebug('Loading Sol...');

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
  const { getSolPackage } = require('./sol-package');

  const packageDir = getSolPackage();

  logDebug('Updating Sol...');
  logDebug('Fetching latest version from GitHub...');

  spawnSync('git pull --rebase', {
    cwd: packageDir.path,
    shell: true,
  });

  spawnSync('npm install', {
    cwd: packageDir.path,
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

  unmutateGlobals();
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

  // Load setup again
  require('../../setup');

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

      log('✅ Sol updated successfully');

      setTimeout(() => {
        startSol();
      }, 0);
    },
  });

  const { getSolPackage } = require('./sol-package');
  const { getLoadedSolExtensions } = require('./sol-extension');
  const { log } = require('../../utils/log');
  const { getCurrentSolWorkspace } = require('./sol-workspace');

  const loadedExtensions = getLoadedSolExtensions();
  const solPackage = getSolPackage();

  log(
    `
${chalk.bold(solReplColor.primary('-=| Welcome to Sol |=-'))}
Workspace: ${solReplColor.warn(getCurrentSolWorkspace().dir.path)}${
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

For usage details see: ${solReplColor.warn(`${solPackage.dir.path}/README.md`)}
`.trimEnd(),
  );

  server.displayPrompt();
}
