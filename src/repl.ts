require('./register');

import * as repl from 'repl';
import { inspect } from 'util';
import { loopWhile } from 'deasync';
import { Sol } from './sol';
import { spawnSync } from 'child_process';

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

  const { runtimeDir } = getSol();
  const modules = runtimeDir.files('**/*.js').map((f) => f.path);

  modules.forEach((module) => {
    delete require.cache[module];
  });

  require('./register');
  setupSolServer(server);
}

function myWriter(output: any) {
  if (typeof output === 'string') {
    return output;
  }

  return inspect(output);
}

function setupSolServer(server: repl.REPLServer) {
  const sol = getSol();
  sol.server = server;

  try {
    const setupFile = sol.localGlobalsFile;
    setupFile.replay();
  } catch (e) {
    console.log('Failed to load local globals.ts file.\n\nError: ' + e.message);
  }
}

export function startSolServer() {
  server = repl.start({ prompt: '> ', writer: myWriter, useGlobal: true });

  let historyReady = false;
  server.setupHistory(getSol().historyFile.path, () => {
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
}
