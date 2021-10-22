import { spawnSync } from 'child_process';

/**
 * Setup Sol modules
 */
export function setupSol(): void {
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
  const { unmutateClass, unmutateObject } = require('./modules/utils/mutation');
  const { clearRequireCache } = require('./modules/utils/module');

  unmutateObject(global);
  unmutateClass(Array);
  unmutateClass(String);
  unmutateClass(Number);
  unmutateClass(Date);
  unmutateClass(Error);
  unmutateClass(Object);
  unmutateClass(Promise);

  const { sol } = require('./modules/sol/sol');
  const { packageDistDir } = sol;
  const modules = packageDistDir
    .files('**/*.js')
    .map((f: any) => f.pathWithoutExt);
  modules.forEach(clearRequireCache);
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
