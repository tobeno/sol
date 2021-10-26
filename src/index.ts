import { spawnSync } from 'child_process';

/**
 * Setup Sol modules
 */
export function setupSol(): void {
  const { logDebug } = require('./modules/utils/log');

  logDebug('Loading Sol...');

  require('./modules/data/setup');
  require('./modules/globals/setup');
  require('./modules/integrations/setup');
  require('./modules/os/setup');
  require('./modules/play/setup');
  require('./modules/sol/setup');
  require('./modules/storage/setup');
  require('./modules/utils/setup');
  require('./modules/web/setup');

  const { sol } = require('./modules/sol/sol');

  sol.load();

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
 * Unloads Sol modules
 */
export function unsetupSol(): void {
  const { logDebug } = require('./modules/utils/log');
  const {
    unmutateClass,
    unmutateGlobals,
  } = require('./modules/utils/mutation');
  const { clearRequireCache } = require('./modules/utils/module');
  const { loadedExtensions } = require('./modules/sol/extension');
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

  const { sol } = require('./modules/sol/sol');
  const modules = [
    ...sol.packageDistDir
      .files('**/*.js')
      .value.map((f: any) => f.pathWithoutExt),
    ...sol.workspace.dir
      .files('**/*.{ts,js}')
      .value.map((f: any) => f.pathWithoutExt),
    ...sol.userWorkspace.dir
      .files('**/*.{ts,js}')
      .value.map((f: any) => f.pathWithoutExt),
    ...loadedExtensions.flatMap((extension: any) =>
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
export function resetupSol(): void {
  unsetupSol();
  setupSol();
}

/**
 * Start Sol REPL server
 */
export function startSol(): void {
  setupSol();

  const { startReplServer } = require('./modules/sol/repl');

  const server = startReplServer();

  server.defineCommand('rebuild', {
    help: 'Rebuilds and reloads Sol using the current source files',
    action() {
      rebuildSol();
      resetupSol();
      server.close();

      setTimeout(() => {
        startSol();
      }, 0);
    },
  });

  server.defineCommand('reload', {
    help: 'Reloads Sol files to reflect latest build',
    action() {
      resetupSol();
      server.close();

      setTimeout(() => {
        startSol();
      }, 0);
    },
  });

  server.displayPrompt();
}
