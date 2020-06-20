require('./register');

import * as repl from 'repl';
import { inspect } from 'util';
import { loopWhile } from 'deasync';
import { Sol } from './sol';
import { spawnSync } from 'child_process';

const server = repl.start({ prompt: '> ', writer: myWriter, useGlobal: true });

/**
 * Returns Sol instance dynamically (to ensure to correct version is used)
 */
function sol(): Sol {
  return require('./sol').sol;
}

/**
 * Runs the build command for Sol
 */
function rebuild() {
  spawnSync('npm run build', {
    cwd: sol().packageDir.path,
    shell: true,
  });
}

/**
 * Reloads the Sol globals without restart
 */
function reload() {
  const { runtimeDir } = sol();
  const modules = runtimeDir.files('**/*.js').map((f) => f.path);

  modules.forEach((module) => {
    delete require.cache[module];
  });

  require('./register');
  sol().server = server;
}

function myWriter(output: any) {
  if (typeof output === 'string') {
    return output;
  }

  return inspect(output);
}

let historyReady = false;
server.setupHistory(sol().historyFile.path, () => {
  historyReady = true;
});
loopWhile(() => !historyReady);

sol().server = server;

server.defineCommand('rebuild', {
  action() {
    rebuild();
    reload();
    this.displayPrompt();
  },
});

server.defineCommand('reload', {
  action() {
    reload();
    this.displayPrompt();
  },
});
