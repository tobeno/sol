import type { ReplOptions, REPLServer } from 'repl';
import * as repl from 'repl';
import { loopWhile } from 'deasync';
import { sol } from './sol';
import * as chalk from 'chalk';
import type { AsyncCompleter, CompleterResult } from 'readline';
import { log } from '../utils/log';

const color = {
  primary: chalk.keyword('coral'),
  ok: chalk.hex('83da44'),
  err: chalk.keyword('crimson'),
  warn: chalk.hex('ddd745'),
  dim: chalk.dim,
};

function solWriter(output: any) {
  return chalk.bold(require('../utils/inspect').inspect(output));
}

async function solCompleter(line: string): Promise<CompleterResult | void> {
  // ToDo: Add custom completion logic
}

function setupReplHistory(server: REPLServer): void {
  let historyReady = false;
  server.setupHistory(sol.workspace.historyFile.create().path, () => {
    historyReady = true;
  });
  loopWhile(() => !historyReady);
}

function setupReplCompleter(server: REPLServer): void {
  const originalCompleter = server.completer.bind(repl);
  (server as any).completer = (async (line, cb) => {
    const result = await solCompleter(line);
    if (typeof result !== 'undefined') {
      cb(null, result);
    }

    originalCompleter(line, cb);
  }) as AsyncCompleter;
}

function setupReplCommands(server: REPLServer): void {
  // ToDo: Add additional commands
}

let currentServer: REPLServer | null = null;

export function getReplServer(): REPLServer {
  if (!currentServer) {
    throw new Error('REPL server not started.');
  }

  return currentServer;
}

export function startReplServer(options: ReplOptions = {}): REPLServer {
  const server = repl.start({
    prompt: color.dim('> '),
    writer: solWriter,
    ignoreUndefined: true,
    useGlobal: true,
    ...options,
  });

  currentServer = server;

  setupReplHistory(server);
  setupReplCompleter(server);
  setupReplCommands(server);

  log(
    `
${chalk.bold(color.primary('-=| Welcome to Sol |=-'))}
Workspace: ${color.warn(sol.workspace.dir)}

Use ${color.primary('.globals [filter]')} and ${color.primary(
      '.extensions',
    )} to find out more about your options.

For usage details see: ${color.warn(`${sol.packageDir.path}/README.md`)}
`.trimEnd(),
  );

  return server;
}
