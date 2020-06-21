require('./setup');

import * as repl from 'repl';
import { loopWhile } from 'deasync';
import { Sol } from './sol';
import { spawnSync } from 'child_process';
import * as chalk from 'chalk';

let server: repl.REPLServer | null = null;

/**
 * Returns Sol instance dynamically (to ensure to correct version is used)
 */
function getSol(): Sol {
  return require('./sol').sol;
}

/**
 * Runs the build command for Sol
 */
function rebuildSol() {
  spawnSync('npm run build', {
    cwd: getSol().packageDir.path,
    shell: true,
  });
}

/**
 * Reloads the Sol globals without restart
 */
function reloadSolServer() {
  if (!server) {
    return;
  }

  let sol = getSol();

  const { runtimeDir, extensions, loadedExtensionNames } = sol;
  const modules = runtimeDir.files('**/*.js').map((f) => f.path);

  modules.forEach((module) => {
    delete require.cache[module];
  });

  require('./setup');
  setupSolServer(server);

  // Refresh Sol instance
  sol = getSol();

  // Re-register extension using strings (to avoid issues with instanceof checks)
  sol.registerExtensions(extensions.map((extension) => extension.dir.path));
  sol.reloadExtensions(loadedExtensionNames);
}

function myWriter(output: any) {
  return require('./utils/inspect').inspect(output);
}

function setupSolServer(server: repl.REPLServer) {
  const sol = getSol();
  sol.server = server;

  sol.setupWorkspace();
}

export function startSolServer() {
  server = repl.start({
    prompt: '> ',
    writer: myWriter,
    ignoreUndefined: true,
    useGlobal: true,
  });

  let historyReady = false;
  server.setupHistory(getSol().historyFile.create().path, () => {
    historyReady = true;
  });
  loopWhile(() => !historyReady);

  server.defineCommand('rebuild', {
    action() {
      rebuildSol();
      reloadSolServer();
      this.displayPrompt();
    },
  });

  server.defineCommand('reload', {
    action() {
      reloadSolServer();
      this.displayPrompt();
    },
  });

  setupSolServer(server);

  const sol = getSol();

  console.log(
    `${chalk.green('Welcome to Sol')} (workspace: ${
      sol.workspaceDir.path
    }, extensions: ${sol.loadedExtensionNames.join(', ')})`,
  );

  server.displayPrompt();
}
