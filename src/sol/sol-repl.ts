import chalk from 'chalk';
import { loopWhile } from 'deasync';
import type { AsyncCompleter, CompleterResult } from 'readline';
import type { ReplOptions, REPLServer } from 'repl';
import repl from 'repl';
import { log } from '../utils/log.utils';
import { getHelp } from '../utils/metadata.utils';
import {
  DefinePropertiesMutation,
  getAppliedMutations,
} from '../utils/mutation.utils';
import { getCurrentSolWorkspace } from './sol-workspace';

export const solReplColor = {
  primary: chalk.keyword('coral'),
  ok: chalk.hex('83da44'),
  err: chalk.keyword('crimson'),
  warn: chalk.hex('ddd745'),
  dim: chalk.dim,
};

/**
 * Default Sol REPL writer / output.
 */
function solWriter(output: any): string {
  return chalk.bold(require('../utils/inspect.utils').inspect(output));
}

/**
 * Default Sol REPL completion handling.
 */
async function solCompleter(line: string): Promise<CompleterResult | void> {
  // ToDo: Add custom completion logic
}

/**
 * Enables the file based REPL history for the given server.
 */
function setupSolReplHistory(server: REPLServer): void {
  let historyReady = false;
  server.setupHistory(
    getCurrentSolWorkspace().dir.file('history').create().path,
    () => {
      historyReady = true;
    },
  );
  loopWhile(() => !historyReady);
}

/**
 * Adds the default REPL completion to the given server.
 */
function setupSolReplCompleter(server: REPLServer): void {
  const originalCompleter = server.completer.bind(repl);
  (server as any).completer = (async (line, cb) => {
    const result = await solCompleter(line);
    if (typeof result !== 'undefined') {
      cb(null, result);
    }

    originalCompleter(line, cb);
  }) as AsyncCompleter;
}

/**
 * Adds the default Sol REPL commands to the given server.
 */
function setupSolReplCommands(server: REPLServer): void {
  server.defineCommand('globals', {
    help: 'Shows available globals',
    action(filter: string | null = null): void {
      let globalEntries = getAppliedMutations(global)
        .filter(
          (mutation): mutation is DefinePropertiesMutation<typeof global> =>
            mutation instanceof DefinePropertiesMutation,
        )
        .reduce(
          (result, mutation) => [
            ...result,
            ...Object.entries(mutation.properties),
          ],
          [] as [string, PropertyDescriptor][],
        )
        .sort((entry1, entry2) => entry1[0].localeCompare(entry2[0]));

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
          const help = getHelp(value);

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

/**
 * Returns the currently running REPL server.
 */
export function getSolReplServer(): REPLServer {
  if (!currentServer) {
    throw new Error('REPL server not started.');
  }

  return currentServer;
}

/**
 * Starts the Sol REPL server (interactive shell).
 */
export function startSolReplServer(options: ReplOptions = {}): REPLServer {
  const server = repl.start({
    prompt: solReplColor.dim('> '),
    writer: solWriter,
    ignoreUndefined: true,
    useGlobal: true,
    ...options,
  });

  currentServer = server;

  setupSolReplHistory(server);
  setupSolReplCompleter(server);
  setupSolReplCommands(server);

  return server;
}
