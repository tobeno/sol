import type { ReplOptions, REPLServer } from 'repl';
import repl from 'repl';
import { loopWhile } from 'deasync';
import chalk from 'chalk';
import type { AsyncCompleter, CompleterResult } from 'readline';
import { log } from '../utils/log';
import { getLoadedExtensions } from './extension';
import { globals } from '../globals/globals';
import { getSolMetadata } from '../utils/metadata';
import { getCurrentWorkspaceDir } from './workspace';

export const solReplColor = {
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
  server.setupHistory(
    getCurrentWorkspaceDir().file('history').create().path,
    () => {
      historyReady = true;
    },
  );
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
  server.defineCommand('globals', {
    help: 'Shows available globals',
    action(filter: string | null = null) {
      let globalEntries = [
        ...new Set([
          ...Object.entries(globals),
          ...getLoadedExtensions().flatMap((e) => Object.entries(e.globals)),
        ]),
      ].sort((entry1, entry2) => entry1[0].localeCompare(entry2[0]));

      if (filter) {
        globalEntries = globalEntries.filter(([key]) => key.includes(filter));
      }

      log(
        `
Available globals:
${
  globalEntries.length
    ? globalEntries
        .map(([key, value]) => {
          const help = getSolMetadata(value)?.help;

          return `- ${solReplColor.primary(key)}${help ? `: ${help}` : ''}`;
        })
        .join('\n')
    : 'No matches found'
}
`.trimStart(),
      );

      server.displayPrompt();
    },
  });
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
    prompt: solReplColor.dim('> '),
    writer: solWriter,
    ignoreUndefined: true,
    useGlobal: true,
    ...options,
  });

  currentServer = server;

  setupReplHistory(server);
  setupReplCompleter(server);
  setupReplCommands(server);

  return server;
}
